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
        produto,
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
            produto,
            formaPagamento,
            statusPedido,
            idStatusPedido,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        // Create
        try {

            const pedidoFindOne = await Pedido.findOne({ idUsuario: idUsuario, idEmpresa: idEmpresa })

            if (pedidoFindOne == null) {

                const pedidoCreate = await Pedido.create(pedido)

                res.status(201).json({
                    success: true,
                    message: "Pedido criada com sucesso!",
                    data: pedidoCreate,
                })
            } else {

                for (let k = 0; k < pedido.produto.length; k++) {

                    let soma = 0;

                    soma = pedido.produto[k].quantidade

                    for (let j = 0; j < pedidoFindOne.produto.length; j++) {

                        if (pedido.produto[k].idProduto == pedidoFindOne.produto[j].idProduto) {

                            soma += pedidoFindOne.produto[j].quantidade;

                            pedidoFindOne.produto[j].quantidade = soma

                            console.log('Soma das quantidades', soma)
                        }
                    }
                }

                const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoFindOne._id }, pedidoFindOne, { new: true })

                res.status(201).json({
                    success: true,
                    message: "Pedido atualizado com sucesso!",
                    data: pedidoUpdate,
                })

            }

        } catch (error) {
            console.log(error)
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

// Patch AtualizaQuantidadePedido
router.patch('/AtualizaQuantidadePedido', async (req, res) => {

    const pedidoId = req.query.IdPedido
    const tipo = req.query.Tipo

    const {
        guid,
        idEmpresa,
        idUsuario,
        nomeUsuario,
        endereco,
        produto,
        formaPagamento,
        statusPedido,
        idStatusPedido,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const pedido = {
        guid,
        idEmpresa,
        idUsuario,
        nomeUsuario,
        endereco,
        produto,
        formaPagamento,
        statusPedido,
        idStatusPedido,
        ativo,
        dataCriacao,
        dataAtualizacao,
    }

    try {

        if (tipo == 0) {

            const pedidoFindOne = await Pedido.findOne({ _id: pedidoId })

            for (let k = 0; k < pedido.produto.length; k++) {

                const subtracao = pedido.produto[k].quantidade;

                console.log('Valor para subtracao', subtracao)

                for (let j = 0; j < pedidoFindOne.produto.length; j++) {

                    if (pedido.produto[k].idProduto == pedidoFindOne.produto[j].idProduto) {

                        console.log('Calculo de subtracao', pedidoFindOne.produto[j].quantidade - subtracao)

                        const total = pedidoFindOne.produto[j].quantidade - subtracao;

                        pedidoFindOne.produto[j].quantidade = total

                        console.log('Subtracao Toral', total)
                    }
                }
            }

            const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoId }, pedidoFindOne, { new: true })

            if (pedidoUpdate == null) {
                res.status(422).json({
                    success: false,
                    message: 'Pedido não pode ser atualizado!',
                    data: [],
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Atualização realizada com sucesso!',
                    data: pedidoUpdate,
                })
            }
        } else {

            const pedidoFindOne = await Pedido.findOne({ _id: pedidoId })

            for (let k = 0; k < pedido.produto.length; k++) {

                let adicao = 0;

                adicao = pedido.produto[k].quantidade

                console.log('Valor para adição', adicao)

                for (let j = 0; j < pedidoFindOne.produto.length; j++) {

                    if (pedido.produto[k].idProduto == pedidoFindOne.produto[j].idProduto) {

                        console.log('Calculo de Adição', pedidoFindOne.produto[j].quantidade - adicao)

                        const total = pedidoFindOne.produto[j].quantidade + adicao;

                        pedidoFindOne.produto[j].quantidade = total

                        console.log('Soma das quantidades', total)
                    }
                }
            }

            const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoId }, pedidoFindOne, { new: true })

            if (pedidoUpdate == null) {
                res.status(422).json({
                    success: false,
                    message: 'Pedido não pode ser atualizado!',
                    data: [],
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Atualização realizada com sucesso!',
                    data: pedidoUpdate,
                })
            }
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