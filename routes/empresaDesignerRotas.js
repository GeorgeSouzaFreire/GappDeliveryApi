const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const EmpresaDesigner = require('../models/EmpresaDesigner')


// Post - Criação de uma EmpresaDesigner
router.post('/PostEmpresaDesigner/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        idEmpresa,
        imagemLogoLogin,
        corBotaoLogin,
        corBotaoSemCadastro,
        corFundoLogin,
        imagemFundoLogin,
        isImagemFundoLogin,
        corToolbar,
        corBotaoAcao,
        corPrimariaFundoProduto,
        corSecundariaFundoProduto
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
            guid,
            idEmpresa,
            imagemLogoLogin,
            corBotaoLogin,
            corBotaoSemCadastro,
            corFundoLogin,
            imagemFundoLogin,
            isImagemFundoLogin,
            corToolbar,
            corBotaoAcao,
            corPrimariaFundoProduto,
            corSecundariaFundoProduto
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
                
                const updatedEmpresaDesigner = await EmpresaDesigner.findOneAndUpdate({ _id: empresaDesignerFind._id }, empresaDesigner)

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

module.exports = router