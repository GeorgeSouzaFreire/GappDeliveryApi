const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Usuario = require('../models/Usuario')



// Create - POST Usuario
router.post('/CadastroUsuario/', async (req, res) => {

    // req.body   
    const { id,
        guid,
        idEmpresa,
        idEstabelecimento,
        nome,
        sobrenome,
        telefone,
        email,
        facebookId,
        googleId,
        idUsuarioEndereco,
        web,
        adminEmpresa,
        adminMaster,
        ativo,
        dataCriacao,
        dataAtualizacao } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O nome é obrigatório'];
    }

    if (!String(telefone).trim()) {
        errors.telefone = ['O telefone é obrigatório'];
    }

    if (!String(email).trim()) {
        errors.email = ['O email é obrigatório'];
    } else if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
        errors.email = ['E-mail não é válido.'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    }

    const usuario = {
        id,
        guid,
        idEmpresa,
        idEstabelecimento,
        nome,
        sobrenome,
        telefone,
        email,
        facebookId,
        googleId,
        idUsuarioEndereco,
        web,
        adminEmpresa,
        adminMaster,
        ativo,
        dataCriacao,
        dataAtualizacao
    }

    // create
    try {

        // Criando dados
        await Usuario.create(usuario)

        res.status(201).json({ sucesso: true, message: "Pessoa inserida com sucesso" })

    } catch (error) {
        res.status(500).json({ sucesso: false, error: error })
    }

})


// Read - Leitura de dados
router.get('/', async (req, res) => {

    try {

        const usuario = await Usuario.find()

        res.status(200).json(usuario)

    } catch (error) {
        res.status(500).json({ error: error })
    }


})

// Validação por Email
router.get('/ValidacaoUsuarioPorEmail/:email', async (req, res) => {

    // extrair o dado da requisição, pela ulr = req.params
    const email = req.params.email

    try {

        const usuario = await Usuario.findOne({ email: email })

        if (!usuario) {
            res.status(422).json({ 
                sucesso: false, 
                message: 'O usuário não foi encontrado!',
                data: [], 
            })
        }

        res.status(200).json({ 
            sucesso: true, 
            mensagem: 'Usuário registrado',
            data: usuario,
        })

    } catch (error) {
        res.status(500).json({ error: error })
    }

})


// Update - Atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const { name, salary, approved } = req.body

    const person = {
        name,
        salary,
        approved,
    }

    try {

        const updatedUsuario = await Usuario.updateOne({ _id: id }, person)

        console.log(updatedUsuario)

        if (updatedUsuario.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        res.status(200).json(person)

    } catch (error) {
        res.status(500).json({ error: error })
    }

})

// Delete
router.delete('/:id', async (req, res) => {


    const id = req.params.id

    const person = await Usuario.findOne({ _id: id })

    if (!person) {
        res.status(422).json({ message: 'O usuário não foi encontrado!' })
        return
    }

    try {

        await Usuario.deleteOne({ _id: id })

        res.status(200).json({ message: 'Usuário removido com sucesso!' })

    } catch (error) {
        res.status(500).json({ error: error })
    }

})


module.exports = router