const router = require('express').Router()

const { response } = require('express')
const Endereco = require('../models/Endereco')

// Post Endereço 
router.post('/PostEndereco', async (req, res) => {

    const {
        id,
        logradouro,
        numero,
        complemento,
        bairro,
        cep,
        cidade,
        latitude,
        longitude
    } = req.body

    const errors = {};

    if (!String(logradouro).trim()) {
        errors.nome = ['O Logradouro é obrigatório'];
    }

    if (!String(numero).trim()) {
        errors.telefone = ['O Número é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const endereco = {
            id,
            logradouro,
            numero,
            complemento,
            bairro,
            cep,
            cidade,
            latitude,
            longitude
        }

        try {

            const enderecoCreate = await Endereco.create(endereco)

            if (enderecoCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível registrar endereço!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Endereço cadastrado com sucesso!",
                    data: enderecoCreate,
                })
            }          

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Endereço.',
                error: error
            })
        }

    }

})


module.exports = router