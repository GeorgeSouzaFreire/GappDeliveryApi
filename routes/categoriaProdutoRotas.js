const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const AWS = require('aws-sdk');
const Categoria = require('../models/Categoria')
const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')
const Imagem = require('../models/Imagem')

require("dotenv/config")

var s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,              // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET       // secretAccessKey is also store in .env file
})

const logAtivo = false;

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
        imagemPrimaria,
        imagemSecundaria,
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
                imagemPrimaria,
                imagemSecundaria,
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
            if (logAtivo)
                console.log('Json {} de Categoria', categoria);

            if (categoria == null) {

                res.status(404).json({
                    success: true,
                    message: "Id Categoria não encontrado!",
                    data: {},
                })

            } else {

                // Criando a Categoria
                const produtoCreate = await Produto.create(produto)

                if (logAtivo)
                    console.log('Json {} de Produto', produtoCreate)
                //***********/

                // Criando a Categoria * Produto
                const categoriaProduto = {
                    idCategoria: categoria._id,
                    idProduto: produtoCreate._id
                };
                const categoriaProdutoCreate = await CategoriaProduto.create(categoriaProduto)

                if (logAtivo)
                    console.log('Json {} de Relacionamento Categoria * Produto', categoriaProdutoCreate)
                //***********/

                const constImagemPrimaria = imagemPrimaria

                if (constImagemPrimaria != null && constImagemPrimaria != '') {

                    let buffer = new Buffer.from(constImagemPrimaria.imagem, 'base64');

                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: produtoCreate._id + '_ID_' + constImagemPrimaria.ordem,
                        Body: buffer,
                        ContentEncoding: 'base64',
                        ContentType: 'image/jpeg',

                    };

                    s3Bucket.upload(params, async function (err, data) {
                        if (err) {
                            console.log(err);
                            console.log('Error uploading data: ', data);
                        } else {
                            console.log('successfully uploaded the image!');

                            const imagemBuffer = {
                                guid: produtoCreate._id,
                                nome: produtoCreate.nome,
                                imagem: null,
                                url: data.Location
                            };

                            // Criando a Imagem Produto
                            const imagemCreate = await Imagem.create(imagemBuffer)

                            if (logAtivo)
                                console.log('Criação da Imagem realizada com sucesso!', imagemCreate);

                            const updatedProduto = await Produto.updateOne({ _id: produtoCreate._id }, { imagemPrimaria: imagemBuffer })

                            if (updatedProduto.matchedCount === 0) {

                                if (logAtivo)
                                    console.log('Update realizado com sucesso!', updatedProduto);
                            }

                        }
                    });

                }

                if (imagemSecundaria != null && imagemSecundaria.length != 0) {

                    const allAsyncResults = []

                    const imagemBuffers = new Promise((resolve, reject) => {

                        imagemSecundaria.forEach(async function (imagem, index, array) {

                            try {
                                if (logAtivo)
                                    console.log('Json {} de Imagem', imagem)

                                let buffer = new Buffer.from(imagem.imagem, 'base64');

                                const params = {
                                    Bucket: process.env.AWS_BUCKET_NAME,
                                    Key: produtoCreate._id + '_ID_' + imagem.ordem,
                                    Body: buffer,
                                    ContentEncoding: 'base64',
                                    ContentType: 'image/jpeg',

                                };

                                s3Bucket.upload(params, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        console.log('Error uploading data: ', data);
                                    } else {
                                        console.log('successfully uploaded the image!');

                                        const imagemBuffer = {
                                            guid: produtoCreate._id,
                                            nome: produtoCreate.nome,
                                            imagem: null,
                                            url: data.Location
                                        };

                                        allAsyncResults.push(imagemBuffer)

                                        if (index === array.length - 1) resolve();
                                    }
                                });

                                //imagemBuffers.push(imagemBuffer);
                                //console.log(imagemBuffers)
                                // Criando a Imagem Produto
                                await Imagem.create(allAsyncResults[index])

                            } catch (error) {
                                console.log('Array Imagens', error);
                            }

                        });

                    });

                    imagemBuffers.then(async () => {
                        console.log('------------------> Está zerado essa porra', allAsyncResults.length)

                        const updatedProdutoUpdateOne = await Produto.updateOne({ _id: produtoCreate._id }, { imagemSecundaria: allAsyncResults })

                        if (logAtivo)
                            console.log(updatedProdutoUpdateOne)
                    });

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

        const categoriasFind = await Categoria.find({ idEstabelecimento: estabelecimentoId, ativo: ativo }).sort({ ordem: 1 })

        if (categoriasFind == null) {
            res.status(422).json({
                success: false,
                message: 'Estabelecimento não possui categoria ou não foi localizado, Tente novamente ou selecione outro estabelecimento.',
                data: [],
            })
        } else {

            var lista = await Promise.all(categoriasFind.map(async (categoria) => {

                const produto = await Produto.find({ idCategoria: { $in: categoria._id }, ativo: ativo })

                categoria.produto = produto

                return categoria;
            }));

            if (lista == null) {
                res.status(422).json({
                    success: false,
                    message: 'O Estabelecimento não foi encontrado!',
                    data: {},
                })
            } else {

                res.status(200).json({
                    success: true,
                    message: 'Foram encontrado ' + lista.length + ' resultado(s) ' + (ativo == true ? 'Ativo' : 'Inativo') + ' cadastrado!',
                    data: { lista },
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