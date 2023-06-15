const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const EmpresaDesigner = require('../models/EmpresaDesigner')
const ConfiguracaoDesign = require('../models/ConfiguracaoDesign')


// Post - Criação de uma EmpresaDesigner
router.post('/PostEmpresaDesigner/', async (req, res) => {

    // req.body   
    const {
        id,
        codigo,
        guid,
        idEmpresa,
        corPrincipal,
        corSecundaria,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(idEmpresa).trim()) {
        errors.idEmpresa = ['O IdEmpresa é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const empresaDesigner = {
            id,
            codigo,
            guid,
            idEmpresa,
            corPrincipal,
            corSecundaria,
            ativo,
            dataCriacao,
            dataAtualizacao
        }

        // Create or Update
        try {

            const empresaDesignerFind = await EmpresaDesigner.findOne({ idEmpresa: Number.parseInt(idEmpresa) })

            if (empresaDesignerFind == null) {

                // Criando dados
                const empresaDesignerCreate = await EmpresaDesigner.create(empresaDesigner)

                res.status(200).json({
                    success: true,
                    message: "Designer empresa registrado!",
                    data: empresaDesignerCreate,
                })

            } else {

                const updatedEmpresaDesigner = await EmpresaDesigner.findOneAndUpdate({ _id: empresaDesignerFind._id }, empresaDesigner, { new: true })

                console.log(updatedEmpresaDesigner)

                if (updatedEmpresaDesigner.matchedCount === 0) {
                    res.status(422).json({
                        success: true,
                        message: 'A Empresa Designer não foi encontrado!',
                        data: {}
                    })
                    return
                }

                res.status(200).json({
                    success: true,
                    message: 'Empresa Designer atualizado!',
                    data: updatedEmpresaDesigner,
                })

            }



        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possível registrar designer empresa.",
                error: error
            })
        }

    }

})

// Post PostConfiguracaoDesign 
router.post('/PostConfiguracaoDesign', async (req, res) => {

    const {
        codigo,
        nome,
        descricao,
        hexa,
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

    if (!String(hexa).trim()) {
        errors.hexa = ['Cor'];
    }

    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        const configuracaoDesign = {
            codigo,
            nome,
            descricao,
            hexa,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        try {

            const configuracaoDesignCreate = await ConfiguracaoDesign.create(configuracaoDesign)

            if (configuracaoDesignCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível cadastrar o Configuração Design!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Configuração Design cadastrado com sucesso!",
                    data: configuracaoDesignCreate,
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Configuração.',
                error: error
            })
        }

    }

})

// GetEmpresaDesigner por IdEmpresa
router.get('/GetEmpresaDesigner', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const empresaId = req.query.IdEmpresa

    try {

        const empresaDesignerFind = await EmpresaDesigner.find({ idEmpresa: Number.parseInt(empresaId) })

        if (empresaDesignerFind == null) {
            res.status(422).json({
                success: false,
                message: 'Empresa Designer não foi encontrado!',
                data: [],
            })
        } else {

            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + empresaDesignerFind.length + ' resultado!',
                data: empresaDesignerFind,
            })

        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a EmpresaDesigner.',
            error: error
        })
    }

})

// GetConfiguracaoDesign
router.get('/GetConfiguracaoDesign', async (req, res) => {

    try {

        const configuracaoDesignFind = await ConfiguracaoDesign.find()

        res.status(200).json({
            success: true,
            message: 'Foram encontrado ' + configuracaoDesignFind.length + ' resultado!',
            data: configuracaoDesignFind,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Configuração Design.',
            error: error
        })
    }

})

module.exports = router