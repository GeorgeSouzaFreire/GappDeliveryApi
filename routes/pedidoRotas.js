const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Pedido = require('../models/Pedido')


// Post - Criação de uma Nova Empresa
router.post('/PostPedido/', async (req, res) => {

    // req.body   
    const {
        guid,
        idEmpresa,
        idUsuario,
        nomeUsuario,
        endereco,
        quantidade,
        formaPagamento,
        statusPedido,
        idStatusPedido,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(idEmpresa).trim()) {
        errors.idEmpresa = ['O IdEmpresa é obrigatório'];
    }

    if (!String(idUsuario).trim()) {
        errors.idUsuario = ['O IdUsuario é obrigatório'];
    }

    if (!String(endereco).trim()) {
        errors.endereco = ['O Endereço é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const pedido = {
            guid,
            idEmpresa,
            idUsuario,
            nomeUsuario,
            endereco,
            quantidade,
            formaPagamento,
            statusPedido,
            idStatusPedido,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        // Create
        try {

            const pedidoFindOne = await Pedido.findOne({_id: idStatusPedido})

            if(pedidoFindOne == null){


                
            }

            // Criando dados
            const pedidoCreate = await Pedido.create(pedido)

            res.status(201).json({
                success: true,
                message: "Pedido criada com sucesso!",
                data: pedidoCreate,
            })

        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error,
                data: {},
            })
        }

    }

})

// Get Pedido App
router.get('/GetPedidoApp', async (req, res) => {

    const empresaId = req.query.IdEmpresa 
    const usuarioId = req.query.IdUsuario

    try {

        const pedidoFindOne = await Pedido.findOne({ 
            idEmpresa: Number.parseInt(empresaId), 
            idUsuario: usuarioId 
        })

        if (pedidoFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'Pedido não encontrado!',
                data: [],
            })
        } else {

            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + pedidoFindOne.length + ' resultado!',
                data: pedidoFindOne,
            })

        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Pedido.',
            error: error
        })
    }


})

module.exports = router