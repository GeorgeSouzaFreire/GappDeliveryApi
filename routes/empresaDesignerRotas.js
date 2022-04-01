const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const EmpresaDesigner = require('../models/EmpresaDesigner')


// Post - Criação de uma Nova Empresa
router.post('/PostEmpresaDesigner/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        logo,
        corPrimaria,
        corSecundaria,
        idEmpresa
    } = req.body

    const errors = {};

    if (!String(idEmpresa).trim()) {
        errors.nome = ['O IdEmpresa é obrigatório'];
    }

    if (!String(idEndereco).trim()) {
        errors.nome = ['O IdEndereco é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const empresaDesigner = {
            id,
            guid,
            logo,
            corPrimaria,
            corSecundaria,
            idEmpresa
        }

        // Create
        try {

            // Criando dados
            const empresaDesignerCreate = await EmpresaDesigner.create(empresaDesigner)

            res.status(201).json({
                success: true,
                message: "Relacionamento Empresa x Endereço criada com sucesso!",
                data: empresaDesignerCreate,
            })

        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

module.exports = router