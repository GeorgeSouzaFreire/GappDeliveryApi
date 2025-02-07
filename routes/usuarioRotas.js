const router = require('express').Router()
const mongoose = require('mongoose')

const { response } = require('express')
const { get } = require('express/lib/response')
const Usuario = require('../models/Usuario')
const UsuarioEndereco = require('../models/UsuarioEndereco')
const { ObjectId } = require('mongodb')
const Empresa = require('../models/Empresa')
const Pedido = require('../models/Pedido')


// GET UsuarioId - Leitura de dados
router.get('/GetUsuarioId', async (req, res) => {

    const userId = req.query.IdUsuario;

    try {

        const usuario = await Usuario.findOne({ _id: mongoose.Types.ObjectId(userId) })

        const empresa = await Empresa.findOne({ idEmpresa: usuario.empresa.idEmpresa })

        usuario.empresa = empresa

        const usuarioUpdateOne = await Usuario.updateOne({ _id: usuario._id }, usuario, { new: true })

        if (usuario != null) {
            res.status(200).json({
                success: true,
                message: 'Usuário encontrado com sucesso!',
                data: usuario,
            })
        } else {
            res.status(201).json({
                success: false,
                message: 'Não foi possível localizar informações de usuário, tente novamente.',
                data: usuario,
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

// Update - Atualização de dados Usuario Endereço (PUT, PATCH)
router.patch('/AtualizaUsuarioEndereco', async (req, res) => {

    const usuarioId = req.query.IdUsuario;
    const guid = req.query.GUID;

    try {

        const usuario = await Usuario.findOne({ _id: mongoose.Types.ObjectId(usuarioId) });

        if (usuario === null) {
            res.status(201).json({
                success: true,
                message: 'Não foi possivel localizar usuário, para atualização do endereço, tente novamente.',
                data: usuario,
            })
        } else {

            usuario.endereco.forEach((endereco) => {
                if (endereco.guid === guid) {
                    endereco.principal = true
                } else {
                    endereco.principal = false
                }
            });

            const usuarioFindByIdAndUpdate = await Usuario.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(usuarioId) }, usuario, { new: true });

            res.status(200).json({
                success: true,
                message: 'Endereço atualizado criado com sucesso!',
                data: { 'endereco': usuarioFindByIdAndUpdate.endereco },
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

// Update - Atualização de dados Usuario Nome/Telefone (PUT, PATCH)
router.patch('/AtualizaUsuarioPerfil', async (req, res) => {

    const usuarioId = req.query.IdUsuario;

    try {

        const {
            nome,
            telefone
        } = req.body

        const usuario = {
            nome,
            telefone
        }

        const usuarioUpdate = await Usuario.findOneAndUpdate({ _id: usuarioId }, usuario, { new: true });

        res.status(200).json({
            success: true,
            message: 'Usuario atualizado com sucesso!',
            data: usuarioUpdate,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível realizar a operação!",
            error: error
        })
    }

})

// Create - POST Usuario
router.post('/PostUsuario/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        codigo,
        empresa,
        estabelecimento,
        endereco,
        imagem,
        nome,
        sobrenome,
        telefone,
        email,
        senha,
        package,
        facebookId,
        googleId,
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

        // Update and Create Usuario
        try {

            // Empresa Package
            const empresa = await Empresa.findOne({ package: package })

            const usuario = {
                id,
                guid,
                codigo,
                empresa,
                estabelecimento,
                endereco,
                imagem,
                nome,
                sobrenome,
                telefone,
                email,
                senha,
                package,
                facebookId,
                googleId,
                web,
                adminEmpresa,
                adminMaster,
                aceitaReceberInfo,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const checkEmail = await Usuario.find({ email: email })
            console.log(email)
            console.log(checkEmail.length === 0)
            if (checkEmail.length === 0) {

                const usuariofindOne = await Usuario.findOne({ 'empresa.idEmpresa': empresa.idEmpresa }).sort({ _id: -1 }).limit(1)

                if (usuariofindOne === null) {

                    // Adiciona = 1 
                    usuario.codigo = 1
                    // Criando dados do Usuário.
                    const usuarioCreate = await Usuario.create(usuario)

                    res.status(200).json({
                        success: true,
                        message: "Pronto, agora você pode aproveitar todo conteúdo disponível!",
                        data: usuarioCreate,
                    })

                } else {

                    // Adiciona .+1 no Codigo Usuario  
                    usuario.codigo = (usuariofindOne.codigo + 1)

                    // Criando dados do Usuário.
                    const usuarioCreate = await Usuario.create(usuario)

                    res.status(200).json({
                        success: true,
                        message: "Pronto, agora você pode aproveitar todo conteúdo disponível!",
                        data: usuarioCreate,
                    })

                }

            } else {

                res.status(200).json({
                    success: false,
                    message: "Já existe cadastro com email informado!",
                    data: checkEmail,
                })

            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Ops, Algo aconteceu de errado, tente novamente.",
                error: error
            })
        }

    }

})

// Create - POST Cadastro Cliente
router.post('/PostCliente/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        codigo,
        empresa,
        estabelecimento,
        endereco,
        imagem,
        nome,
        sobrenome,
        telefone,
        email,
        senha,
        package,
        facebookId,
        googleId,
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

        // Update and Create Usuario
        try {

            // Empresa Package
            const empresa = await Empresa.findOne({ package: package })

            const usuario = {
                id,
                guid,
                codigo,
                empresa,
                estabelecimento,
                endereco,
                imagem,
                nome,
                sobrenome,
                telefone,
                email,
                senha,
                package,
                facebookId,
                googleId,
                web,
                adminEmpresa,
                adminMaster,
                aceitaReceberInfo,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const checkEmail = await Usuario.find({ email: email })
            console.log(email)
            console.log(checkEmail.length === 0)
            if (checkEmail.length === 0) {

                const usuariofindOne = await Usuario.findOne({ 'empresa.idEmpresa': empresa.idEmpresa }).sort({ _id: -1 }).limit(1)

                if (usuariofindOne === null) {

                    // Adiciona = 1 
                    usuario.codigo = 1
                    // Criando dados do Usuário.
                    const usuarioCreate = await Usuario.create(usuario)

                    res.status(200).json({
                        success: true,
                        message: "Cliente cadastrado com sucesso!",
                        data: usuarioCreate,
                    })

                } else {

                    // Adiciona .+1 no Codigo Usuario  
                    usuario.codigo = (usuariofindOne.codigo + 1)

                    // Criando dados do Usuário.
                    const usuarioCreate = await Usuario.create(usuario)

                    res.status(200).json({
                        success: true,
                        message: "Cliente cadastrado com sucesso!",
                        data: usuarioCreate,
                    })

                }

            } else {

                res.status(200).json({
                    success: false,
                    message: "Já existe cadastro com email informado!",
                    data: checkEmail,
                })

            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Ops, Algo aconteceu de errado, tente novamente.",
                error: error
            })
        }

    }

})

// Create - POST Usuario
router.post('/PostUsuarioEndereco/', async (req, res) => {

    const usuarioId = req.query.IdUsuario;

    const {
        guid,
        logradouro,
        numero,
        complemento,
        bairro,
        cep,
        cidade,
        latitude,
        longitude,
        principal,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body



    const endereco = {
        guid,
        logradouro,
        numero,
        complemento,
        bairro,
        cep,
        cidade,
        latitude,
        longitude,
        principal,
        ativo,
        dataCriacao,
        dataAtualizacao
    }

    try {

        const usuario = await Usuario.findOne({ _id: mongoose.Types.ObjectId(usuarioId) });

        if (usuario != null) {

            console.log(usuario.endereco)
            console.log(endereco)

            if (usuario.endereco != null && usuario.endereco != 0) {
                usuario.endereco.forEach((endereco) => {
                    endereco.principal = false;
                });
            }

            await Usuario.updateOne({ _id: mongoose.Types.ObjectId(usuarioId) }, usuario, { new: true });

            const usuarioFindOne = await Usuario.findOneAndUpdate({ _id: mongoose.Types.ObjectId(usuarioId) }, { $push: { 'endereco': endereco } }, { new: true });

            if (usuarioFindOne == null) {
                console.log(usuarioFindOne)
                res.status(201).json({
                    success: true,
                    message: 'Não foi possivel localizar usuário, para criação do endereço, tente novamente.',
                    data: usuarioFindOne,
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Endereço criado com sucesso!',
                    data: usuarioFindOne,
                })
            }

        } else {
            res.status(200).json({
                success: false,
                message: 'Usuário não localizado!',
                data: {},
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

// GET Usuario - Leitura de dados
router.get('/GetUsuario', async (req, res) => {

    const emailId = req.query.Email;
    const senhaId = req.query.Senha;
    const empresaId = req.query.IdEmpresa;

    console.log(emailId)
    console.log(senhaId)

    try {

        const errors = {};

        if (!String(emailId).trim() && !String(senhaId).trim()) {
            errors.nome = ['Favor informar email e senha!'];
        } else {
            if (!String(emailId).trim()) {
                errors.nome = ['Email obrigatório'];
            }
            if (!String(senhaId).trim()) {
                errors.nome = ['Senha obrigatório'];
            }
        }

        if (Object.keys(errors).length) {
            res.status(422).json({ error: errors })
        } else {

            const usuario = await Usuario.findOne({ email: emailId, senha: senhaId, idEmpresa: empresaId })

            if (usuario != null) {

                const empresa = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

                usuario.empresa = empresa

                const usuarioUpdateOne = await Usuario.updateOne({ _id: usuario._id }, usuario, { new: true })

                res.status(200).json({
                    success: true,
                    message: 'Usuário encontrado com sucesso!',
                    data: usuario,
                })
            } else {
                res.status(201).json({
                    success: false,
                    message: 'Não foi possível localizar uma conta com esse nome de usuário. Tente outra ou obtenha uma nova conta.',
                    data: {},
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possível realizar a operação!",
            error: error
        })
    }


})

// GET Usuario - Leitura de dados
router.get('/GetUsuarios', async (req, res) => {

    try {

        const empresaId = req.query.IdEmpresa

        const usuario = await Usuario.find({ idEmpresa: empresaId })

        if (usuario.length != 0) {
            res.status(200).json({
                success: true,
                message: 'Usuários encontrados com sucesso!',
                data: usuario,
            })
        } else {
            res.status(201).json({
                success: true,
                message: 'Não foi possivel obter os Usuários.',
                data: usuario,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possível realizar a operação!",
            error: error
        })
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

// GET Usuario - Leitura de dados
router.get('/GetUsuarioEnderecoPrincipal', async (req, res) => {

    const usuarioId = req.query.IdUsuario;

    try {

        const usuarioFindOne = await Usuario.findOne({ _id: mongoose.Types.ObjectId(usuarioId) });

        var endereco;

        usuarioFindOne.endereco.forEach((end) => {
            if (end.principal) {
                endereco = end;
                console.log(end);
            }
        });

        if (endereco == null) {
            res.status(422).json({
                success: false,
                message: 'Não há endereços(s) cadastrada(s) para esse usuário.',
                data: {},
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Endereço localizado com sucesso!',
                data: endereco,
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

// Delete Produto do Pedido
router.delete('/ExcluirUsuarioEndereco', async (req, res) => {

    const usuarioEnderecoId = req.query.IdUsuarioEndereco
    const guid = req.query.GUID

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

// GET Usuario - Leitura de dados
router.get('/GetClienteSintetico', async (req, res) => {

    try {

        const empresaId = req.query.IdEmpresa

        const usuario = await Usuario.find({ 'empresa.idEmpresa': Number.parseInt(empresaId) })

        if (usuario.length != 0) {


            var pontosDisponivel = 0;

            var arrays = await Promise.all(usuario.map(async (user) => {

                const pedido = await Pedido.find({ idUsuario: mongoose.Types.ObjectId(user._id) });

                let quantidadeTotal = 0
                var valorTotal = 0.0

                pedido.forEach((ped) => {

                    for (let j = 0; j < ped.item.length; j++) {

                        quantidadeTotal += ped.item[j].quantidade;

                        if (ped.item[j].produto == null) {
                            valorTotal = 0.0
                        } else {
                            valorTotal += ped.item[j].produto.precoAtual * quantidadeTotal;
                        }

                    }
                });

                const formatter = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                return {
                    'cliente': user,
                    'quantidadePedido': pedido.length,
                    'valorTotalPedido': formatter.format(valorTotal),
                    'pontosDisponivel': pontosDisponivel
                };
            }));

            res.status(200).json({
                success: true,
                message: 'Clientes encontrados com sucesso!',
                data: arrays,
            })
        } else {
            res.status(201).json({
                success: true,
                message: 'Não foi possivel obter os Clientes.',
                data: usuario,
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