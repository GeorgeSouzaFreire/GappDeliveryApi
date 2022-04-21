const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const EmpresaEndereco = require('../models/EmpresaEndereco')


// Post - Criação de uma Nova Empresa
router.post('/PostEmpresaEndereco/', async (req, res) => {

    // req.body   
    const { 
        id,
        idEmpresa,
        idEndereco,               
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
    }else{

    const empresaEndereco = {
        id,        
        idEmpresa,
        idEndereco        
    }

    // Create
    try {

        // Criando dados
        const empresaEnderecoCreate = await EmpresaEndereco.create(empresaEndereco)

        res.status(201).json({ 
            success: true, 
            message: "Relacionamento Empresa x Endereço criada com sucesso!",
            data: empresaEnderecoCreate,
        })

    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }

}

})

module.exports = router