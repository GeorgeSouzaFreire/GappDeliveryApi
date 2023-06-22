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
const FormaPagamento = require('../models/FormaPagamento')
const EstabelecimentoFormaPagamento = require('../models/EstabelecimentoFormaPagamento')

// Post - Criação de uma Nova Empresa
router.post('/PostEstabelecimento/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        empresa,
        imagem,
        nome,
        tipoEstabelecimento,
        cnpj,
        endereco,
        horario,
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
            empresa,
            imagem,
            nome,
            tipoEstabelecimento,
            cnpj,
            endereco,
            horario,
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

            // Create Estabelecimento
            const estabelecimentoCreate = await Estabelecimento.create(estabelecimento)

            // Criando a Horario   
            const horarios = estabelecimento.horario;

            horarios.forEach(async (horario) => {

                try {
                    const horarioCreate = await Horario.create(horario)
                } catch (error) {
                    console.log('Array Horario', error);
                }

            });

            res.status(200).json({
                success: true,
                message: "Estabelecimento cadastrado com sucesso!",
                data: estabelecimentoCreate,
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possivel registrar o Estabelecimento!",
                error: error
            })
        }

    }

})

// GetEstabelecimentoPorIdEmpresa por IdEmpresa
router.get('/GetEstabelecimentoPorIdEmpresa', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const empresaId = req.query.IdEmpresa

    try {

        const estabelecimentos = await Estabelecimento.find({ "empresa.idEmpresa": Number.parseInt(empresaId) })

        estabelecimentos.forEach(async function(estabelecimento) {

            try {

                const empresa = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

                estabelecimento.empresa = empresa
    
                const estabelecimentoUpdateOne = await Estabelecimento.updateOne({ _id: estabelecimento._id }, estabelecimento, { new: true })

            } catch (error) {
                console.log('Array Update Estabelecimento', error);
            }

        });

        if (estabelecimentos == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + estabelecimentos.length + ' resultado(s) cadastrado!',
                data: estabelecimentos,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel registrar o Estabelecimento!",
            error: error
        })
    }

})

// Create 
router.get('/GetFormaPagamento', async (req, res) => {

    const estabelecimentoId = req.query.IdEstabelecimento
    const ativoId = req.query.Ativo

    try {

        console.log('Id do Estabelecimento!', estabelecimentoId)

        const estabelecimentoFormaPagamentoFind = await EstabelecimentoFormaPagamento.find({ idEstabelecimento: estabelecimentoId, ativo: ativoId })

        if (estabelecimentoFormaPagamentoFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: {},
            })
        } else {

            var lista = await Promise.all(estabelecimentoFormaPagamentoFind.map(async (estabelecimentoFormaPagamento) => {

                const formaDePagamentoFind = await FormaPagamento.findOne({ _id: estabelecimentoFormaPagamento.idFormaPagamento }).sort({ ordem: 1 })

                return formaDePagamentoFind;
            }));

            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + lista.length + ' resultado(s) cadastrado!',
                data: { lista },
            })
        }



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel realizar a busca da Forma de Pagamento!",
            error: error
        })
    }

})

// Post Forma de Pagamento 
router.post('/PostFormaPagamento', async (req, res) => {

    try {

        req.body.forEach(async function (item) {

            const {
                guid,
                tipo,
                idTipo,
                ordem,
                ativo,
                dataCriacao,
                dataAtualizacao,
            } = item

            const formaPagamento = {
                guid,
                tipo,
                idTipo,
                ordem,
                ativo,
                dataCriacao,
                dataAtualizacao,
            }

            // Criando dados Forma de Pagamento
            const formaPagamentoCreate = await FormaPagamento.create(formaPagamento)

            console.log('Forma de Pagamento criada com sucesso!', formaPagamentoCreate)

            console.log(formaPagamento)
        })

        res.status(200).json({
            success: true,
            message: 'Forma de Pagamento registrada com sucesso!',
            data: req.body,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível registrar o Forma de Pagamento!",
            error: error
        })
    }

})

// Create 
router.patch('/AtualizarFormaPagamentoEstabelecimento', async (req, res) => {

    try {

        const estabelecimentoId = req.query.IdEstabelecimento

        req.body.forEach(async function (item) {


            console.log(item)

            const {
                id,
                ativo,
                dataAtualizacao,
            } = item

            const formaPagamento = {
                id,
                ativo,
                dataAtualizacao,
            }

            // Criando dados Forma de Pagamento
            const formaPagamentoFindOne = await FormaPagamento.findOne({ _id: formaPagamento.id })

            console.log(formaPagamentoFindOne)

            console.log('Busca de Forma de Pagamento realizada com sucesso!', formaPagamentoFindOne)

            if (formaPagamentoFindOne == null) {
                res.status(422).json({
                    success: true,
                    message: 'Não foi possível registrar Forma de Pagamento!',
                    data: req.body,
                })
            } else {

                const estabelecimentoFormaPagamentoUpdateOrCreate = await EstabelecimentoFormaPagamento.findOne({ idFormaPagamento: formaPagamentoFindOne._id })

                console.log('Busca EstabelecimentoFormaPagamento para ver ser atualizamos!', estabelecimentoFormaPagamentoUpdateOrCreate)

                if (estabelecimentoFormaPagamentoUpdateOrCreate == null) {

                    const estabelecimentoFormaPagamento = {
                        idEstabelecimento: estabelecimentoId,
                        idFormaPagamento: formaPagamentoFindOne._id,
                        ativo: formaPagamento.ativo,
                    };

                    const estabelecimentoFormaPagamentoCreate = await EstabelecimentoFormaPagamento.create(estabelecimentoFormaPagamento)

                    console.log('Relacionamento Estabelecimento x Forma de Pagamento criado com sucesso!', estabelecimentoFormaPagamentoCreate)

                } else {
                    const estabelecimentoFormaPagamentoCreate = await EstabelecimentoFormaPagamento.updateOne({ _id: estabelecimentoFormaPagamentoUpdateOrCreate._id }, estabelecimentoFormaPagamentoUpdateOrCreate)

                    console.log('Relacionamento Estabelecimento x Forma de Pagamento atualizado com sucesso!', estabelecimentoFormaPagamentoCreate)
                }

            }
        })

        res.status(200).json({
            success: true,
            message: 'Forma de Pagamento Por Estabelcimento atualizado com sucesso!',
            data: req.body,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível atualizar a Forma de Pagamento!",
            error: error
        })
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
                const estabelecimentoHorarioFindOne = await HorarioEstabelecimento.findOne({ idEstabelecimento: estabelecimentoId })

                const horarioCreate = await Horario.updateOne({ _id: estabelecimentoHorarioFindOne.idHorario.String }, horario)
                console.log('Json {} de Horario UpdateOne', horarioCreate)

            } catch (error) {
                console.log('Array Horario', error);
            }

        });

        const updatedEstabelecimento = await Estabelecimento.updateOne({ _id: estabelecimentoId }, estabelecimento)

        if (updatedEstabelecimento.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram atualizado(s) ' + estabelecimento.length + ' resultado(s) cadastrado!',
                data: estabelecimento,
            })
        }


    } catch (error) {
        console.log('Erro - 500', error);
        res.status(500).json({ error: error })
    }

})


module.exports = router