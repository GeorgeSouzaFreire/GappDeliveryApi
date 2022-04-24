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

        // Create
        try {

            // Criando dados
            const empresaDesignerCreate = await EmpresaDesigner.create(empresaDesigner)

            res.status(200).json({
                success: true,
                message: "Designer empresa registrado!",
                data: empresaDesignerCreate,
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possível registrar designer empresa.",
                error: error
            })
        }

    }

})

module.exports = router