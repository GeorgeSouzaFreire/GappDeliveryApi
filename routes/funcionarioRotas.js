const router = require('express').Router()

const { response } = require('express')
const Endereco = require('../models/Endereco')
const Funcionario = require('../models/Funcionario')
const Cargo = require('../models/Cargo')
const Permissao = require('../models/Permissao')
const Empresa = require('../models/Empresa')

// Post Funcionario 
router.post('/PostFuncionario', async (req, res) => {

    const {
        nome,
        email,
        cargo,        
        empresa,
        estabelecimento,
        permissao,
        login,
        senha,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome'];
    }

    if (!String(email).trim()) {
        errors.email = ['Email'];
    }

    if (!String(permissao).trim()) {
        errors.permissao = ['Permissao'];
    }

    if (Object.keys(errors).length) {

        if (Object.keys(errors).length <= 1) {
            errors.itens = ['\nExite ' + Object.keys(errors).length + ' item obrigatório!'];
        } else {
            errors.itens = ['\nExistem ' + Object.keys(errors).length + ' itens obrigatórios!'];
        }

        res.status(422).json({ error: errors })
    } else {

        const funcionario = {
            nome,
            email,
            cargo,            
            empresa,
            estabelecimento,
            permissao,
            login,
            senha,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        try {

            const funcionarioCreate = await Funcionario.create(funcionario)

            if (funcionarioCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível registrar Funcionário!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Funcionário cadastrado com sucesso!",
                    data: funcionarioCreate,
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Funcionário.',
                error: error
            })
        }

    }

})

// Post Cargo 
router.post('/PostCargo', async (req, res) => {

    const {
        nome,
        idEmpresa,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O Nome é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const cargo = {
            nome,
            idEmpresa,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        try {

            const cargoCreate = await Cargo.create(cargo)

            if (cargoCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível registrar cargo!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Cargo cadastrado com sucesso!",
                    data: cargoCreate,
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Cargo.',
                error: error
            })
        }

    }

})

// Get Pedido App
router.get('/GetCargos', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const cargoFind = await Cargo.find({ idEmpresa: empresaId })

        if (cargoFind == null) {
            res.status(205).json({
                success: false,
                message: 'Você ainda não adicionou nenhum cargo para empresa!',
                data: {},
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + cargoFind.length + ' resultado!',
                data: cargoFind,
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do cargo.',
            error: error
        })
    }
})

// Get Funcionario
router.get('/GetFuncionario', async (req, res) => {

    const loginId = req.query.Email
    const senhaId = req.query.Senha

    try {

        console.log("Login: "  + loginId)
        console.log("Senha: "  + senhaId)

        const errors = {};
        const mensagem = {};

        if (!String(loginId).trim()) {
            errors.email = 'Email ' + '"' + loginId + '"';
        }

        if (!String(senhaId).trim()) {
            errors.senha = 'Senha ' + '"' + senhaId + '"';
        }

        if (Object.keys(errors).length) {

            mensagem.mensagem = 'Você não pode se conectar como ' + errors.email + ',' + errors.senha + ' informado' + '.\nNão conseguimos encontrar este usuário. Por favor, tente novamente'

            res.status(422).json({ error: mensagem })
        } else {

            const funcionarioFindOne = await Funcionario.findOne({ login: loginId, senha: senhaId })

            console.log(funcionarioFindOne)

            if (funcionarioFindOne === null) {
                
                res.status(201).json({
                    success: false,
                    message: 'Ops! Não encontramos nenhum cadastro',
                    data: null,
                })

            } else if (funcionarioFindOne.ativo) {

                const empresa = await Empresa.findOne({idEmpresa: funcionarioFindOne.empresa.idEmpresa})

                console.log('Empresa' , empresa.designer);

                funcionarioFindOne.empresa = empresa

                const empresaUpdateOne = await Funcionario.updateOne({ _id: funcionarioFindOne._id },funcionarioFindOne, { new: true })

                console.log('Funcionario' , funcionarioFindOne);

                res.status(200).json({
                    success: true,
                    message: 'Funcionário encontrado ' + funcionarioFindOne.nome + '!',
                    data: funcionarioFindOne,
                })

            } else {

                res.status(201).json({
                    success: false,
                    message: 'Login inativo, entre em contato com administrador.',
                    data: null,
                })

            }

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Usuário.',
            error: error
        })
    }
})

// Get Funcionario Por ID
router.get('/GetFuncionarioPorId', async (req, res) => {

    const id = req.query.Id

    try {

        const funcionarioFind = await Funcionario.findOne({ _id: id })

        if (funcionarioFind == null) {
            res.status(201).json({
                success: false,
                message: 'Ops! Não encontramos nenhum cadastro!',
                data: null,
            })
        } else {

            funcionarioFind.empresa = await Empresa.findOne({idEmpresa: funcionarioFind.empresa.idEmpresa})

            res.status(200).json({
                success: true,
                message: 'Funcionários encontrados ' + funcionarioFind.nome + '!',
                data: funcionarioFind,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do cargo.',
            error: error
        })
    }
})

// Get Funcionario
router.get('/GetListFuncionarioPorIdEmpresa', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const funcionarioFind = await Funcionario.find({ idEmpresa: empresaId })

        if (funcionarioFind == null) {
            res.status(201).json({
                success: false,
                message: 'Ops! Não encontramos nenhum cadastro!',
                data: null,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Funcionários encontrados ' + funcionarioFind.length + '!',
                data: funcionarioFind,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do cargo.',
            error: error
        })
    }
})

// Post Permissao 
router.post('/PostPermissao', async (req, res) => {

    try {

        req.body.forEach(async (permissao) => {

            try {

                await Permissao.create(permissao)

            } catch (error) {
                console.log('Array Horario', error);
            }

        });

        res.status(200).json({
            success: true,
            message: "Permissão cadastrado com sucesso!",
            data: req.body,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Permissão.',
            error: error
        })
    }

})

// Get Permissao 
router.get('/GetPermissao', async (req, res) => {

    try {

        const permissaoFind = await Permissao.find()

        if (permissaoFind == null) {
            res.status(205).json({
                success: false,
                message: 'Não permissões para carregar!',
                data: {},
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + permissaoFind.length + ' resultado!',
                data: permissaoFind,
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Permissão.',
            error: error
        })
    }

})

// Patch AtualizarFuncionario
router.patch('/AtualizarFuncionario', async (req, res) => {

    const funcionarioId = req.query.IdFuncionario

    const {
        nome,
        email,
        cargo,
        idCargo,
        idEmpresa,
        estabelecimento,
        permissao,
        login,
        senha,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const funcionario = {
        nome,
        email,
        cargo,
        idCargo,
        idEmpresa,
        estabelecimento,
        permissao,
        login,
        senha,
        ativo,
        dataCriacao,
        dataAtualizacao,
    }

    try {

        const funcionarioUpdate = await Funcionario.findOneAndUpdate({ _id: funcionarioId }, funcionario, { new: true })

        if (funcionarioUpdate == null) {
            res.status(422).json({
                success: false,
                message: 'Funcionário não pode ser atualizado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Atualização realizada com sucesso!',
                data: funcionarioUpdate,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Ops, Algo de errado por aqui...' + error,
            error: error
        })
    }

})


module.exports = router