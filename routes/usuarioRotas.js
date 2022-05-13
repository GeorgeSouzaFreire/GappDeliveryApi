const router = require('express').Router()
const mongoose = require('mongoose')

const { response } = require('express')
const { get } = require('express/lib/response')
const Usuario = require('../models/Usuario')
const UsuarioEndereco = require('../models/UsuarioEndereco')
const { ObjectId } = require('mongodb')



// Create - POST Usuario
router.post('/PostUsuario/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        idEmpresa,
        idEstabelecimento,
        nome,
        sobrenome,
        telefone,
        email,
        senha,
        facebookId,
        googleId,
        idUsuarioEndereco,
        web,
        adminEmpresa,
        adminMaster,
        aceitaReceberInfo,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O nome é obrigatório'];
    }

    if (!String(telefone).trim()) {
        errors.telefone = ['O telefone é obrigatório'];
    }

    if (!String(senha).trim()) {
        errors.senha = ['Sua senha é fundamental, Anote para não esquecer.'];
    }

    if (!String(email).trim()) {
        errors.email = ['O email é obrigatório'];
    } else if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
        errors.email = ['E-mail não é válido.'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const usuario = {
            id,
            guid,
            idEmpresa,
            idEstabelecimento,
            nome,
            sobrenome,
            telefone,
            email,
            senha,
            facebookId,
            googleId,
            idUsuarioEndereco,
            web,
            adminEmpresa,
            adminMaster,
            aceitaReceberInfo,
            ativo,
            dataCriacao,
            dataAtualizacao
        }

        // create
        try {

            // Criando dados
            const usuarioCreate = await Usuario.create(usuario)

            res.status(201).json({
                success: true,
                message: "Pronto, agora você pode aproveitar todo conteúdo disponível!",
                data: usuarioCreate,
            })

        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

// Create - POST Usuario
router.post('/PostUsuarioEndereco/', async (req, res) => {

    // req.body   
    const {
        usuario,
        endereco,
        entrega,
    } = req.body

    const errors = {};

    if (!String(usuario).trim()) {
        errors.nome = ['O Usuário é obrigatório'];
    }

    if (!String(entrega.logradouro).trim()) {
        errors.logradouro = ['Logradouro é obrigatório'];
    }

    if (!String(entrega.numero).trim()) {
        errors.numero = ['Número é obrigatório'];
    }

    if (!String(entrega.bairro).trim()) {
        errors.bairro = ['Bairro é obrigatório'];
    }

    if (!String(entrega.bairro).trim()) {
        errors.complemento = ['Complemento é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const usuarioEndereco = {
            usuario,
            endereco,
            entrega
        }

        //console.log(usuarioEndereco)

        try {

            const usuarioFindOne = await UsuarioEndereco.findOne({ idUsuario: usuario });

            if (usuarioFindOne == null) {

                // Criando dados
                const usuarioEnderecoCreate = await UsuarioEndereco.create(usuarioEndereco)

                if (usuarioEnderecoCreate == null) {
                    res.status(201).json({
                        success: true,
                        message: "Não foi possível registrar o endereço informado!",
                        data: usuarioEnderecoCreate,
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Seu endereço foi registrado com sucesso!",
                        data: usuarioEnderecoCreate,
                    })
                }

            } else {

                usuarioFindOne.entrega = entrega

                for (let k = 0; k < endereco.length; k++) {
                    usuarioFindOne.endereco.push(endereco[k])
                }

                const usuarioEnderecoFindOneAndUpdate = await UsuarioEndereco.findOneAndUpdate({ _id: usuarioFindOne._id }, usuarioFindOne, { new: true })

                res.status(200).json({
                    success: true,
                    message: "Seu endereço foi registrado com sucesso!",
                    data: usuarioEnderecoFindOneAndUpdate,
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possível realizar a operação!",
                error: error
            })
        }

    }

})

// Create - POST Usuario
router.post('/PostUsuarioFormaPagamento/', async (req, res) => {

    // req.body   
    const {
        usuario,
        endereco,
        entrega,
    } = req.body

    const errors = {};

    if (!String(usuario).trim()) {
        errors.nome = ['O Usuário é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const usuarioEndereco = {
            usuario,
            endereco,
            entrega
        }

        console.log(usuarioEndereco)

        try {

            // Criando dados
            const usuarioEnderecoCreate = await UsuarioEndereco.create(usuarioEndereco)

            if (usuarioEnderecoCreate == null) {
                res.status(201).json({
                    success: true,
                    message: "Não foi possível registrar o endereço informado!",
                    data: usuarioEnderecoCreate,
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Seu endereço foi registrado com sucesso!",
                    data: usuarioEnderecoCreate,
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possível realizar a operação!",
                error: error
            })
        }

    }

})



// GET Usuario - Leitura de dados
router.get('/GetUsuario', async (req, res) => {

    const emailId = req.query.Email;
    const senhaId = req.query.Senha;

    console.log(emailId)
    console.log(senhaId)

    try {

        if (emailId != '' & senhaId != '') {
            const usuario = await Usuario.findOne({ email: emailId, senha: senhaId })

            if (usuario != null) {
                res.status(200).json({
                    success: true,
                    message: 'Usuário encontrado com sucesso!',
                    data: usuario,
                })
            } else {
                res.status(201).json({
                    success: true,
                    message: 'Não foi possivel localizar Usuário.',
                    data: usuario,
                })
            }


        } else {
            const usuario = await Usuario.findOne({ email: emailId })

            res.status(200).json({
                success: true,
                message: 'Parâmetro de Email',
                data: usuario,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }


})

// GET Usuario - Leitura de dados
router.get('/GetUsuarioEndereco', async (req, res) => {

    const usuarioId = req.query.IdUsuario;

    try {

        const usuarioFindOne = await UsuarioEndereco.findOne({ idUsuario: usuarioId });

        if (usuarioFindOne == null) {           
            res.status(201).json({
                success: true,
                message: 'Não há Endereço cadastrado!',
                data: usuarioFindOne,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Busca do Usuário realizada com sucesso!',
                data: usuarioFindOne,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível realizar a operação!",
            error: error
        })
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
                success: false,
                message: 'O usuário não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Ops, O Email informado já foi registrado!',
                data: usuario,
            })
        }



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

// Update - Atualização de dados Usuario Endereço (PUT, PATCH)
router.patch('/AtualizaUsuarioEndereco/:IdUsuarioEndereco', async (req, res) => {

    console.log(req.query)

    const usuarioEnderecoId = req.params.IdUsuarioEndereco

    console.log(usuarioEnderecoId)

    const {
        usuario,
        endereco,
        entrega
    } = req.body

    const usuarioEndereco = {
        usuario,
        endereco,
        entrega
    }

    console.log(usuarioEndereco)

    try {

        const usuarioFindOne = await UsuarioEndereco.findByIdAndUpdate({ _id: usuarioEnderecoId }, usuarioEndereco);

        if (usuarioFindOne == null) {
            console.log(usuarioFindOne)
            res.status(201).json({
                success: true,
                message: 'Não foi possivel localizar Usuário.',
                data: usuarioFindOne,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Busca do Usuário Endereco realizada com sucesso!',
                data: usuarioFindOne,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível realizar a operação!",
            error: error
        })
    }

})

// Delete Produto do Pedido
router.delete('/ExcluirUsuarioEndereco', async (req, res) => {

    const usuarioEnderecoId  = req.query.IdUsuarioEndereco
    const guid  = req.query.GUID
  
    try {

        const usuarioEnderecoFindOne = await UsuarioEndereco.findOne({ _id: usuarioEnderecoId })

        if (usuarioEnderecoFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'Usuário Endereço não foi localizado',
                data: {},
            })
        } else {

            console.log(usuarioEnderecoFindOne.endereco)

            for (let j = 0; j < usuarioEnderecoFindOne.endereco.length; j++) {

                console.log('ID --- > Query / BD', 'Endereço' + ' * ' + usuarioEnderecoFindOne.endereco[j])

                if (usuarioEnderecoFindOne.endereco[j] != null && usuarioEnderecoFindOne.endereco[j] != undefined) {
                    if (guid == usuarioEnderecoFindOne.endereco[j].guid) {
                        console.log('Antes Delete --- > ', usuarioEnderecoFindOne.endereco[j])
                        delete usuarioEnderecoFindOne.endereco[j];
                        console.log('Depois Delete --- > ', usuarioEnderecoFindOne.endereco[j])
                    }
                }
            }

            usuarioEnderecoFindOne.endereco = cleanArray(usuarioEnderecoFindOne.endereco);

            if (usuarioEnderecoFindOne.endereco.length == 0) {

                const usuarioEnderecoDelete = await UsuarioEndereco.deleteOne({ _id: usuarioEnderecoFindOne._id })

                res.status(200).json({
                    success: true,
                    message: 'Foram excluido todos os endereço, Endereço cadastrado foi deletado!',
                    data: usuarioEnderecoDelete,
                })

            } else {

                const usuarioEnderecoUpdate = await UsuarioEndereco.findOneAndUpdate({ _id: usuarioEnderecoFindOne._id }, usuarioEnderecoFindOne, { new: true })

                res.status(200).json({
                    success: true,
                    message: 'Endereço excluido com sucesso!',
                    data: usuarioEnderecoUpdate,
                })

            }
           
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Usuário Endereco.',
            error: error
        })
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

function cleanArray(actual) {
    var newArray = new Array();
    console.log('Atual --- > ', actual)
    for (var i = 0; i < actual.length; i++) {
        if (actual[i] != null || actual[i] != undefined) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}


module.exports = router