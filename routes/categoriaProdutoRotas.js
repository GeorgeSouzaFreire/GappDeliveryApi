const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Categoria = require('../models/Categoria')
const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')
const Imagem = require('../models/Imagem')

// Post - Criação de uma Novo Produto
router.post('/PostProduto/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        idCategoria,
        precoAntigo,
        precoAtual,
        promocao,
        desconto,
        nome,
        parcela,
        descricao,
        imagem,
        isExibeDesconto,
        isExibePromocao,
        isExibePrecoAntigo,
        isExibeParcela,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome é obrigatório'];
    }

    if (!String(precoAtual).trim()) {
        errors.precoAtual = ['Preço é obrigatório'];
    }

    if (!String(descricao).trim()) {
        errors.descricao = ['Descrição é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        try {

            const produto = {
                id,
                guid,
                idCategoria,
                precoAntigo,
                precoAtual,
                promocao,
                desconto,
                nome,
                parcela,
                descricao,
                imagem,
                isExibeDesconto,
                isExibePromocao,
                isExibePrecoAntigo,
                isExibeParcela,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            // Buscando o Categoria
            const categoria = await Categoria.findOne({ _id: idCategoria })
            //***********/
            //console.log('Json {} de Estabelecimento', estabelecimento);
            if (categoria == null) {

                res.status(404).json({
                    success: true,
                    message: "Id Categoria não encontrado!",
                    data: {},
                })

            } else {

                // Criando a Categoria
                const produtoCreate = await Produto.create(produto)
                console.log('Json {} de Produto', produtoCreate)
                //***********/

                // Criando a Categoria * Produto
                const categoriaProduto = {
                    idCategoria: categoria._id,
                    idProduto: produtoCreate._id
                };
                const categoriaProdutoCreate = await CategoriaProduto.create(categoriaProduto)
                console.log('Json {} de Relacionamento Categoria * Produto', categoriaProdutoCreate)
                //***********/

                if (imagem != null && imagem != '') {
                    //let base64 = data.toString('base64');
                    //console.log(base64.substr(0, 200));
                    //Buffer.from(string[, encoding])
                    let burger = new Buffer.from(imagem, 'base64');

                    const imagemBuffer = {
                        guid: produtoCreate.guid,
                        nome: produtoCreate.nome,
                        imagem: burger,
                    };

                    // Criando a Imagem Produto
                    const imagemProdutoCreate = await Imagem.create(imagemBuffer)
                    console.log('Json {} de Imagem Produto', imagemProdutoCreate)
                    //***********/

                    var thumb = new Buffer.from(imagemProdutoCreate.imagem).toString('base64');
                    produtoCreate.imagem = thumb;
                }



                res.status(201).json({
                    success: true,
                    message: "Produto cadastrado com sucesso!",
                    data: produtoCreate,
                })



            }


        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

// GetCategoria por IdEstabelecimento
router.get('/GetCategoriaProduto', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const estabelecimentoId = req.query.IdEstabelecimento
    const ativo = req.query.Ativo

    try {

        const categorias = await Categoria.find({ idEstabelecimento: estabelecimentoId, ativo: ativo }).sort({ ordem: 1 })

        //console.log(categorias)
        //console.log(ativo)

        if (categorias == null) {
            res.status(422).json({
                success: false,
                message: 'Estabelecimento não possui categoria ou não foi localizado, Tente novamente ou selecione outro estabelecimento.',
                data: [],
            })
        } else {

            var categoriasAux = await Promise.all(categorias.map(async (categoria) => {

                const produto = await Produto.find({ idCategoria: { $in: categoria._id }, ativo: ativo })

                categoria.produto = produto

                return categoria;
            }));

            if (categoriasAux == null) {
                res.status(422).json({
                    success: false,
                    message: 'O Estabelecimento não foi encontrado!',
                    data: categoriasAux,
                })
            } else {

                res.status(200).json({
                    success: true,
                    message: 'Foram encontrado ' + categoriasAux.length + ' resultado(s) ' + (ativo == true ? 'Ativo' : 'Inativo') + ' cadastrado!',
                    data: categoriasAux,
                })
            }

        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a categoria.',
            error: error
        })
    }

})

// GetCategoria por IdEstabelecimento
router.get('/GetProdutoPorIdCategoria', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const categoriaId = req.query.IdCategoria
    const ativo = req.query.Ativo

    try {

        const produto = await Produto.find({ idCategoria: categoriaId, ativo: ativo })

        console.log(produto)
        console.log(ativo)

        if (produto == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + produto.length + ' resultado(s) ' + (ativo == true ? 'Ativo' : 'Inativo') + ' cadastrado!',
                data: produto,
            })
        }



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a categoria.',
            error: error
        })
    }

})

// Update - Desativar Produto (PUT, PATCH)
router.patch('/DesativarProduto', async (req, res) => {

    const produtoId = req.query.IdProduto

    const {
        id,
        guid,
        idCategoria,
        precoAntigo,
        precoAtual,
        promocao,
        desconto,
        nome,
        parcela,
        descricao,
        imagem,
        isExibeDesconto,
        isExibePromocao,
        isExibePrecoAntigo,
        isExibeParcela,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const produto = {
        id,
        guid,
        idCategoria,
        precoAntigo,
        precoAtual,
        promocao,
        desconto,
        nome,
        parcela,
        descricao,
        imagem,
        isExibeDesconto,
        isExibePromocao,
        isExibePrecoAntigo,
        isExibeParcela,
        ativo,
        dataCriacao,
        dataAtualizacao
    }

    try {

        const updatedProduto = await Produto.updateOne({ _id: produtoId }, produto)

        console.log(updatedProduto)

        if (updatedProduto.matchedCount === 0) {
            res.status(422).json({ message: 'O Produto não foi encontrado!' })
            return
        }

        res.status(200).json({
            success: true,
            message: 'Produto desativado com sucesso!',
            data: produto,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a produto.',
            error: error
        })
    }

})

module.exports = router