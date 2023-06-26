const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const AWS = require('aws-sdk');
const Categoria = require('../models/Categoria')
const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')
const Imagem = require('../models/Imagem')
const fileSystem = require('fs');

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
            const categoria = await Categoria.findOne({ _id: Object(idCategoria) })
                
            if (categoria == null) {

                res.status(404).json({
                    success: true,
                    message: "Id Categoria não encontrado!",
                    data: {},
                })

            } else {

                const imagePrimariaCreate = await Imagem.create(imagemPrimaria)

                var origin = 'C:\\Users\\George Freire\\Documents\\Foto';

                var opsys = process.platform;
                if (opsys == "darwin") {
                    origin = 'C:\\Users\\George Freire\\Documents\\Foto';
                } else if (opsys == "win32" || opsys == "win64") {
                    origin = 'C:\\Users\\George Freire\\Documents\\Foto\\categoria\\';
                } else if (opsys == "linux") {
                    origin = '/home/empresa' + categoria.empresa.idEmpresa +'/categoria/' + categoria.nome + '/image/';
                }

                if (!fileSystem.existsSync(origin)) {
                     fileSystem.mkdirSync(origin, { recursive: true });
                }

                const path = (origin + guid + '.png')
               
                fileSystem.writeFileSync(path, imagePrimariaCreate.base64, 'base64' , function (err) {
                    if (err) {
                        console.log("failed to save");
                      } else {
                        console.log("succeeded in saving");
                      }
                });

                imagePrimariaCreate.base64 = '';
                imagePrimariaCreate.url = '';

                const imagePrimariaCreateUpdateOne = await Imagem.updateOne({ _id: imagePrimariaCreate._id }, imagePrimariaCreate, { new: true })

                // Criando o Produto com Imagens
                const produtoCreate = await Produto.create(produto)

                res.status(200).json({
                    success: true,
                    message: "Produto cadastrado com sucesso!",
                    data: produtoCreate,
                })
            }


        } catch (error) {
            res.status(500).json({
                message: 'Não foi possível acessar as informações.',
                success: false,
                error: error
            })
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