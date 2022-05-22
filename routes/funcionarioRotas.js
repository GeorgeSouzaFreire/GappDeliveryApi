const router = require('express').Router()

const { response } = require('express')
const Endereco = require('../models/Endereco')
const Funcionario = require('../models/Funcionario')
const Cargo = require('../models/Cargo')

// Post Funcionario 
router.post('/PostFuncionario', async (req, res) => {

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

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['O Nome é obrigatório'];
    }

    if (!String(email).trim()) {
        errors.email = ['O Email é obrigatório'];
    }

    if (!String(cargo).trim()) {
        errors.cargo = ['O Cargo é obrigatório'];
    }

    if (!String(permissao).trim()) {
        errors.permissao = ['O Permissao é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

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
router.get('/GetCargo', async (req, res) => {

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


module.exports = router