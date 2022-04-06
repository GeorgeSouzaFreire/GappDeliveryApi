const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Empresa = require('../models/Empresa')
const Estabelecimento = require('../models/Estabelecimento')
const Endereco = require('../models/Endereco')
const EstabelecimentoEndereco = require('../models/EstabelecimentoEndereco')
const EmpresaEstabelecimento = require('../models/EmpresaEstabelecimento')
const HorarioEstabelecimento = require('../models/HorarioEstabelecimento')
const Horario = require('../models/Horario')

// Post - Criação de uma Nova Empresa
router.post('/PostEstabelecimento/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        idEmpresa,
        nome,
        endereco,
        horario,
        icone,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O nome é obrigatório'];
    }

    if (!String(telefone1).trim()) {
        errors.telefone = ['O Telefone é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const estabelecimento = {
            id,
            guid,
            idEmpresa,
            nome,
            endereco,
            horario,
            icone,
            telefone1,
            telefone2,
            telefone3,
            facebook,
            instagram,
            whatsapp,
            ativo,
            dataCriacao,
            dataAtualizacao
        }

        // Create
        try {

            // Buscando Empresa 
            const empresa = await Empresa.findOne({ id: idEmpresa })

            // Criando o Estabelecimento            
            const estabelecimentoCreate = await Estabelecimento.create(estabelecimento)
            console.log('Json {} de Estabelicimento', estabelecimentoCreate)
            /*************/

            // Criando o Empresa x Estabelecimento
            const empresaEstabelecimento = { idEstabelecimento: estabelecimentoCreate._id, idEmpresa: empresa._id };
            const empresaEstabelecimentoCreate = await EmpresaEstabelecimento.create(empresaEstabelecimento)
            console.log('Json {} de Relacionamento Empresa x Estabelicimento', empresaEstabelecimentoCreate)
            /*************/

            // Criando a Endereço
            const enredeco = estabelecimento.endereco;
            const enderecoCreate = await Endereco.create(enredeco)
            console.log('Json {} de Endereço', enderecoCreate)
            /*************/

            // Criando a EstabelecimentoEndereco
            const estabelecimentoEnredeco = { idEstabelecimento: estabelecimentoCreate._id, idEndereco: enderecoCreate._id };
            const estabelecimentoEnderecoCreate = await EstabelecimentoEndereco.create(estabelecimentoEnredeco)
            console.log('Json {} de Relacionamento Estabelecimento * Endereço', estabelecimentoEnderecoCreate)
            /*************/

            // Criando a Horario   
            const horarios = estabelecimento.horario;

            horarios.forEach(async (horario) => {

                try {
                    console.log('Json {} de Horario', horario)

                    const horarioCreate = await Horario.create(horario)

                    // Criando a HorarioEstabelecimento
                    const horarioEstabelecimento = { idEstabelecimento: estabelecimentoCreate._id, idHorario: horarioCreate._id };
                    const estabelecimentoEnderecoCreate = await HorarioEstabelecimento.create(horarioEstabelecimento)
                    console.log('Json {} de Relacionamento Horario * Estabelecimento', estabelecimentoEnderecoCreate)

                } catch (error) {
                    console.log('Array Horario', error);
                }

            });
            /*************/

            res.status(201).json({
                success: true,
                message: "Estabelecimento criada com sucesso!",
                data: estabelecimentoCreate,
            })

        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

// GetEstabelecimentoPorIdEmpresa por IdEmpresa
router.get('/GetEstabelecimentoPorIdEmpresa/:IdEmpresa', async (req, res) => {

    //console.log(req)

    // extrair o dado da requisição, pela url = req.params
    const id = req.params.IdEmpresa

    try {

        const estabelecimento = await Estabelecimento.find({ id: Number.parseInt(id) })

        console.log(estabelecimento)

        if (estabelecimento == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + estabelecimento.length + ' resultado(s) cadastrado!',
                data: estabelecimento,
            })
        }



    } catch (error) {
        res.status(500).json({ error: error })
    }

})

// Put - Estabelecimento
router.patch('/:idEstabelecimento', async (req, res) => {

    const estabelecimentoId = req.params.idEstabelecimento

    const {
        id,
        guid,
        idEmpresa,
        nome,
        endereco,
        horario,
        icone,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const estabelecimento = {
        id,
        guid,
        idEmpresa,
        nome,
        endereco,
        horario,
        icone,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    }

    try {

        // Update no Endereço
        const estabelecimentoEnderecoFindOne = await EstabelecimentoEndereco.findOne({ idEstabelecimento: estabelecimentoId })
        console.log('Json {} de EstabelecimentoEndereco findOne', estabelecimentoEnderecoFindOne)
        const enderecoUpdateOne = await Endereco.updateOne({ _id: estabelecimentoEnderecoFindOne.idEndereco.String }, estabelecimento.enredeco)
        console.log('Json {} de Endereço UpdateOne', enderecoUpdateOne)

        // Update no Horario
        const horarios = estabelecimento.horario;

        horarios.forEach(async (horario) => {

            try {
                
                // Buscando a HorarioEstabelecimento                
                const estabelecimentoHorarioFindOne = await HorarioEstabelecimento.findOne( { idEstabelecimento: estabelecimentoId })
                
                const horarioCreate = await Horario.updateOne({_id: estabelecimentoHorarioFindOne.idHorario.String}, horario)
                console.log('Json {} de Horario UpdateOne', horarioCreate)

            } catch (error) {
                console.log('Array Horario', error);
            }

        });

        const updatedEstabelecimento = await Estabelecimento.updateOne({_id: estabelecimentoId}, estabelecimento)

        if (updatedEstabelecimento.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram atualizado(s) ' + updatedEstabelecimento.length + ' resultado(s) cadastrado!',
                data: estabelecimento,
            })
        }


    } catch (error) {
        console.log('Erro - 500', error);
        res.status(500).json({ error: error })
    }

})


module.exports = router