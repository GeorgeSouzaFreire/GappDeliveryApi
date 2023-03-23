const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Empresa = require('../models/Empresa')
const Endereco = require('../models/Endereco')
const Designer = require('../models/EmpresaDesigner')
const EmpresaDesigner = require('../models/EmpresaDesigner')
const Plano = require('../models/Plano')

// Post - Criação de uma Nova Empresa
router.post('/PostEmpresa/', async (req, res) => {

    // req.body   
    const {
        idEmpresa,
        guid,
        nome,
        cnpj,
        endereco,
        telefone,
        celular,
        email,
        designer,
        plano,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome'];
    }

    if (!String(endereco.cep).trim()) {
        errors.cep = ['CEP'];
    }

    if (!String(endereco.logradouro).trim()) {
        errors.logradouro = ['Logradouro'];
    }

    if (!String(email).trim()) {
        errors.email = ['Email'];
    }

    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        try {

            const empresa = {
                idEmpresa,
                guid,
                nome,
                cnpj,
                endereco,
                telefone,
                celular,
                email,
                designer,
                plano,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const empresaFind = await Empresa.findOne().sort({ _id: -1 }).limit(1)

            console.log('Retorno FindOne Empresa' + empresaFind);

            if (empresaFind == null) {

                // Criando a Empresa
                const empresaCreate = await Empresa.create(empresa)

                res.status(201).json({
                    success: true,
                    message: "Empresa criada com sucesso!",
                    data: empresaCreate,
                })

            } else {

                // Adiciona .+1 no Id Empresa 
                empresa.idEmpresa = (empresaFind.idEmpresa + 1)

                empresa.designer.idEmpresa = empresa.idEmpresa

                console.log(empresa.idEmpresa);

                // Criando a Empresa
                const empresaCreate = await Empresa.create(empresa)

                res.status(201).json({
                    success: true,
                    message: "Empresa criada com sucesso!",
                    data: empresaCreate,
                })

            }


        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar a Empresa.',
                error: error
            })
        }

    }

})

// Validação por Email
router.get('/ValidacaoEmpresaPorId/:Id', async (req, res) => {

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

// Get Empresa
router.get('/GetEmpresaApp', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const empresaFindOne = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

        if (empresaFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {

            const empresaDesigner = await EmpresaDesigner.findOne({ idEmpresa: Number.parseInt(empresaFindOne.idEmpresa) })

            empresaFindOne.designer = empresaDesigner

            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFindOne,
            })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetEmpresaPorId', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const empresaFindOne = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

        if (empresaFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {

            const empresaDesigner = await EmpresaDesigner.findOne({ idEmpresa: Number.parseInt(empresaFindOne.idEmpresa) })

            empresaFindOne.designer = empresaDesigner

            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFindOne,
            })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetEmpresas', async (req, res) => {


    try {

        const empresaFind = await Empresa.find()

        if (empresaFind == null) {
            res.status(201).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFind,
            })
        }

        console.log('Foram encontradas ', empresaFind.length + ' empresas!')

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetPlanos', async (req, res) => {


    try {

        const planoFind = await Plano.find()

        if (planoFind.length == 0) {
            res.status(201).json({
                success: false,
                message: 'Os Planos não foram encontrados!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Planos encontrados com sucesso!',
                data: planoFind,
            })
        }

        console.log('Foram encontradas ', planoFind.length + ' planos!')

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Plano.',
            error: error
        })
    }

})

// Delete Empresa 
router.delete('/ExcluirEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.find({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            await Empresa.deleteMany({ idEmpresa: empresaId })

            res.status(200).json({
                success: true,
                message: 'Empresa excluida com sucesso!',
                data: empresaFind,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Desativar Empresa 
router.patch('/DesativarEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.findOne({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            const empresaUpdateOne = await Empresa.findOneAndUpdate({ idEmpresa: empresaFind._id }, empresaFind, { new: true })

            res.status(200).json({
                success: true,
                message: 'Empresa atualizada com sucesso!',
                data: empresaUpdateOne,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Desativar Empresa 
router.patch('/AtualizaEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.findOne({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            const {
                idEmpresa,
                guid,
                nome,
                cnpj,
                endereco,
                telefone,
                celular,
                email,
                designer,
                plano,
                ativo,
                dataCriacao,
                dataAtualizacao
            } = req.body

            const empresa = {
                idEmpresa,
                guid,
                nome,
                cnpj,
                endereco,
                telefone,
                celular,
                email,
                designer,
                plano,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const empresaUpdateOne = await Empresa.findOneAndUpdate({ idEmpresa: empresaId }, empresa, { new: true })

            console.log(empresaUpdateOne)

            res.status(200).json({
                success: true,
                message: 'Empresa atualizada com sucesso!',
                data: empresaUpdateOne,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Post Plano 
router.post('/PostPlano', async (req, res) => {

    const {
        nome,
        codigo,
        quantidadeEstabelecimento,
        quantidadeProduto,
        quantidadeCategoria,
        quantidadeImagem,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome'];
    }

    if (!String(codigo).trim()) {
        errors.codigo = ['Codigo'];
    }


    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        const plano = {
            nome,
            codigo,
            quantidadeEstabelecimento,
            quantidadeProduto,
            quantidadeCategoria,
            quantidadeImagem,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        try {

            const planoCreate = await Plano.create(plano)

            if (planoCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível cadastrar o Plano!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Plano cadastrado com sucesso!",
                    data: planoCreate,
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Plano.',
                error: error
            })
        }

    }

})


module.exports = router