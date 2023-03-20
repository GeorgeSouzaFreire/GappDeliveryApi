const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')
const StatusPedido = require('../models/StatusPedido')

// Post - Criação de uma Nova Empresa
router.post('/PostPedido/', async (req, res) => {

    // req.body   
    const {
        guid,
        idEmpresa,
        idUsuario,
        nomeUsuario,
        endereco,
        item,
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

    if (!String(item).trim()) {
        errors.item = ['O Produto é obrigatório'];
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
            item,
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

                var newArray = new Array();
                var newContainsMongo = new Array();

                for (let k = 0; k < pedido.item.length; k++) {

                    let soma = 0;

                    soma = pedido.item[k].quantidade

                    for (let j = 0; j < pedidoFindOne.item.length; j++) {

                        console.log('Id ---> Json', pedido.item[k].produto._id + '  <---> Id -- Banco --- >' + pedidoFindOne.item[j].produto._id)

                        if (pedido.item[k].produto._id == pedidoFindOne.item[j].produto._id) {

                            soma += pedidoFindOne.item[j].quantidade;

                            pedidoFindOne.item[j].quantidade = soma

                            console.log('Soma das quantidades', soma)
                        }

                        var isPush = newContainsMongo.includes(pedidoFindOne.item[j].produto._id)

                        if (isPush == false) {
                            newArray.push(pedidoFindOne.item[j])
                            newContainsMongo.push(pedidoFindOne.item[j].produto._id)
                        }

                    }

                }

                // O que aconteceu aqui Dev????? By George Freire
                for (let k = 0; k < pedido.item.length; k++) {

                    var isPush = newContainsMongo.includes(pedido.item[k].produto._id)

                    if (isPush == false) {
                        newArray.push(pedido.item[k])
                    }

                }

                console.log('New Contains Mongo ---- > ', newContainsMongo)

                pedidoFindOne.item = newArray

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
            res.status(205).json({
                success: false,
                message: 'Você ainda não adicionou nenhum item no carrinho!',
                data: {},
            })
        } else {

            let quantidadeTotal = 0
            var valorTotal = 0.0

            for (let j = 0; j < pedidoFindOne.item.length; j++) {

                quantidadeTotal += pedidoFindOne.item[j].quantidade;

                if (pedidoFindOne.item[j].produto == null) {
                    valorTotal = 0.0
                } else {
                    valorTotal += pedidoFindOne.item[j].produto.precoAtual;
                }

            }

            console.log('Calculo do Pedido ', 'Quantidade = ' + quantidadeTotal + ' * ' + valorTotal + ' = R$ ' + ((quantidadeTotal * valorTotal) * 100 / 100).toFixed(2))

            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + pedidoFindOne.length + ' resultado!',
                data: {
                    quantidadeTotal: quantidadeTotal,
                    valorTotal: ((quantidadeTotal * valorTotal) * 100 / 100).toFixed(2),
                    pedido: pedidoFindOne
                },
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


// Get Pedido App
router.get('/GetPedidoPorId', async (req, res) => {

    const pedidoId = req.query.IdPedido

    try {

        const pedidoFindOne = await Pedido.findOne({ _id: pedidoId })

        if (pedidoFindOne == null) {
            res.status(205).json({
                success: false,
                message: 'Você ainda não adicionou nenhum item no carrinho!',
                data: {},
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

// Patch AtualizaEndereco
router.patch('/AtualizaEndereco', async (req, res) => {

    const pedidoId = req.query.IdPedido

    const {
        endereco,
    } = req.body

    const pedido = {
        endereco,
    }

    console.log('Patch - AtualizaEndereco', pedido)

    try {

        const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoId }, pedido, { new: true })

        if (pedidoUpdate == null) {
            res.status(422).json({
                success: false,
                message: 'Endereço não pode ser atualizado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Atualização realizada com sucesso!',
                data: pedidoUpdate,
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

// Patch AtualizaFormaPagamento
router.patch('/AtualizaFormaPagamento', async (req, res) => {

    const pedidoId = req.query.IdPedido

    const {
        formaPagamento,
    } = req.body

    const pedido = {
        formaPagamento,
    }

    console.log('Patch - AtualizaFormaPagamento', pedido)

    try {

        const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoId }, pedido, { new: true })

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

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Ops, Algo de errado por aqui...' + error,
            error: error
        })
    }

})

// Patch AtualizaFormaPagamento
router.patch('/AtualizaObservacaoPedido', async (req, res) => {

    const pedidoId = req.query.IdPedido

    const {
        observacao,
    } = req.body

    const pedido = {
        observacao,
    }

    console.log('Patch - AtualizaObservacaoPedido', pedido)

    try {

        const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoId }, pedido, { new: true })

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

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Ops, Algo de errado por aqui...' + error,
            error: error
        })
    }

})

// Patch AtualizaQuantidadePedido
router.patch('/AtualizaQuantidadeProdutoPedido', async (req, res) => {

    const pedidoId = req.query.IdPedido
    const tipo = req.query.Tipo

    const {
        guid,
        idEmpresa,
        idUsuario,
        nomeUsuario,
        endereco,
        item,
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
        item,
        formaPagamento,
        statusPedido,
        idStatusPedido,
        ativo,
        dataCriacao,
        dataAtualizacao,
    }

    try {

        console.log('Tipo ----- > ', tipo)

        if (tipo == 0) {

            const pedidoFindOne = await Pedido.findOne({ _id: pedidoId })

            for (let k = 0; k < pedido.item.length; k++) {

                const subtracao = pedido.item[k].quantidade;

                console.log('Valor para subtracao', subtracao)

                for (let j = 0; j < pedidoFindOne.item.length; j++) {

                    console.log('Calculo de subtracao', pedido.item[k].produto._id + ' / ' + pedidoFindOne.item[j].produto._id)

                    if (pedido.item[k].produto._id == pedidoFindOne.item[j].produto._id) {

                        console.log('Calculo de subtracao', pedidoFindOne.item[j].quantidade - subtracao)

                        const total = pedidoFindOne.item[j].quantidade - subtracao;

                        if (total >= 1) {
                            pedidoFindOne.item[j].quantidade = total

                            console.log('Subtracao Toral', total)
                        } else {
                            console.log('O Total já é ----> ', total + ' então não vamos adicionar mais na lista')
                        }


                    }
                }
            }

            console.log('Tamanho da Lista de Item ----> ', pedidoFindOne.item.length)

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

            for (let k = 0; k < pedido.item.length; k++) {

                let adicao = 0;

                adicao = pedido.item[k].quantidade

                console.log('Valor para adição', adicao)

                for (let j = 0; j < pedidoFindOne.item.length; j++) {


                    console.log('Id -- > ', pedido.item[k].produto._id + ' Id -- > ' + pedidoFindOne.item[j].produto._id)

                    if (pedido.item[k].produto._id == pedidoFindOne.item[j].produto._id) {

                        console.log('Calculo de Adição', pedidoFindOne.item[j].quantidade - adicao)

                        const total = pedidoFindOne.item[j].quantidade + adicao;

                        pedidoFindOne.item[j].quantidade = total

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

// Delete Produto do Pedido
router.delete('/ExcluirProdutoCarrinho', async (req, res) => {

    const pedidoId = req.query.IdPedido
    const produtoId = req.query.IdProduto

    try {

        const pedidoFindOne = await Pedido.findOne({ _id: pedidoId })

        if (!pedidoFindOne) {
            res.status(422).json({
                success: false,
                message: 'Pedido não pode ser localizado!',
                data: {},
            })
        } else {

            for (let j = 0; j < pedidoFindOne.item.length; j++) {

                console.log('ID --- > Query / BD', produtoId + ' * ' + pedidoFindOne.item[j])

                if (pedidoFindOne.item[j] != null && pedidoFindOne.item[j] != undefined) {
                    if (produtoId == pedidoFindOne.item[j].produto._id) {
                        console.log('Antes Delete --- > ', pedidoFindOne.item[j])
                        delete pedidoFindOne.item[j];
                        console.log('Depois Delete --- > ', pedidoFindOne.item[j])
                    }
                }
            }

            pedidoFindOne.item = cleanArray(pedidoFindOne.item);

            if (pedidoFindOne.item.length == 0) {

                const pedidoDelete = await Pedido.deleteOne({ _id: pedidoFindOne._id })

                res.status(200).json({
                    success: true,
                    message: 'Foram excluido todos os produto do pedido, Pedido foi deletado!',
                    data: pedidoDelete,
                })

            } else {

                const pedidoUpdate = await Pedido.findOneAndUpdate({ _id: pedidoFindOne._id }, pedidoFindOne, { new: true })

                res.status(200).json({
                    success: true,
                    message: 'Produto excluido com sucesso!',
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

// Get Status Pedido App
router.get('/GetStatusPedido', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const statusPedidoFindOne = await StatusPedido.findOne({ idEmpresa: empresaId })

        if (statusPedidoFindOne == null) {
            res.status(205).json({
                success: false,
                message: 'Status de Pedido não carregado! [205]',
                data: {},
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + statusPedidoFindOne + ' resultado!',
                data: statusPedidoFindOne,
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível realizar a buscar do Status Pedido.',
            error: error
        })
    }
})

// Create Status Pedido
router.post('/PostStatusPedido', async (req, res) => {


    const {
        guid,
        idEmpresa,
        nome,
        codigo,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(idEmpresa).trim()) {
        errors.idEmpresa = ['O IdEmpresa é obrigatório'];
    }

    if (!String(nome).trim()) {
        errors.nome = ['O Nome é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {
      
        const statusPedido = {
            guid,
            idEmpresa,
            nome,
            codigo,
            ativo,
            dataCriacao,
            dataAtualizacao
        }

        // create
        try {

            // Criando dados
            const statusPedido = await StatusPedido.create(statusPedido)

            res.status(201).json({
                success: true,
                message: "Status Pedido criada com sucesso!",
                data: pedidoCreate,
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Status Pedido.',
                error: error
            })
        }
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