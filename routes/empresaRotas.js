const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Empresa = require('../models/Empresa')
const Endereco = require('../models/Endereco')
const EmpresaEndereco = require('../models/EmpresaEndereco')

// Post - Criação de uma Nova Empresa
router.post('/PostEmpresa/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        nome,
        nomeFantasia,
        cnpj,
        endereco,
        telefoneFixo,
        celular,
        email
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O nome é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        try {

            const empresa = {
                id,
                guid,
                nome,
                nomeFantasia,
                cnpj,
                endereco,
                telefoneFixo,
                celular,
                email
            }

            console.log('Json {} de Empresa', empresa)

            // Criando a Empresa
            const empresaCreate = await Empresa.create(empresa)

            const enredeco = empresa.endereco;

            console.log('Json {} de Endereço', enredeco)

            // Criando a Endereço
            const enderecoCreate = await Endereco.create(enredeco)

            const empresaEnredeco = {
                idEmpresa: empresaCreate._id,
                idEndereco: enderecoCreate._id
            };

            console.log('Json {} de Relacionamento Empresa * Endereço', empresaEnredeco)

            // Criando a EmpresaEndereco
            await EmpresaEndereco.create(empresaEnredeco)

            res.status(201).json({
                success: true,
                message: "Empresa criada com sucesso!",
                data: empresaCreate,
            })

        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

// Validação por Email
router.get('/ValidacaoEmpresaPorId/:Id', async (req, res) => {

    //console.log(req)

    // extrair o dado da requisição, pela ulr = req.params
    const id = req.params.Id

    console.log(req.params.Id)

    try {

        const empresa = await Empresa.findOne({ id: Number.parseInt(id) })

        console.log(empresa)

        if (!empresa) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Ops, O Id ' + id + ' da empresa ' + empresa.nome + ' informado já foi registrado!',
                data: empresa,
            })
        }



    } catch (error) {
        res.status(500).json({ error: error })
    }

})


module.exports = router