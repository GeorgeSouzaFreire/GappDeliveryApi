const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Categoria = require('../models/Categoria')
const Produto = require('../models/Produto')
const CategoriaProduto = require('../models/CategoriaProduto')

// Post - Criação de uma Nova Empresa
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
        errors.nome = ['O nome é obrigatório'];
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

                res.status(201).json({
                    success: true,
                    message: "Produto criada com sucesso!",
                    data: produtoCreate,
                })



            }


        } catch (error) {            
            res.status(500).json({ success: false, error: error })
        }

    }

})

module.exports = router