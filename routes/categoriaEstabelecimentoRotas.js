const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Categoria = require('../models/Categoria')
const Produto = require('../models/Produto')
const CategoriaEstabelecimento = require('../models/CategoriaEstabelecimento')
const Estabelecimento = require('../models/Estabelecimento')

// Post - Criação de uma Nova Categoria
router.post('/PostCategoria/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        empresa,
        estabelecimento,
        ordem,
        nome,
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

            const categoria = {
                id,
                guid,
                empresa,
                estabelecimento,
                ordem,
                nome,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            // Criando a Categoria
            const categoriaCreate = await Categoria.create(categoria)
            console.log('Json {} de Categoria', categoriaCreate)

            res.status(200).json({
                success: true,
                message: "Categoria cadastrada com sucesso!",
                data: categoriaCreate,
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possível criar a categoria.",
                error: error
            })
        }

    }

})

// GetCategoria por IdEstabelecimento
router.get('/GetCategoriaPorIdEstabelecimento', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const estabelecimentoId = req.query.IdEstabelecimento
    const ativo = req.query.Ativo

    try {

        const categoria = await Categoria.find({ "estabelecimento.guid": estabelecimentoId, ativo: ativo }).sort({ ordem: 1 })

        if (categoria.length == 0) {
            res.status(422).json({
                success: false,
                message: 'Não há categoria para o estabelecimento, cadastre uma nova categoria.',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + categoria.length + ' resultado(s) ' + (ativo == true ? 'Ativo' : 'Desativo') + ' cadastrado!',
                data: categoria,
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

// Update - Desativar Categoria (PUT, PATCH)
router.patch('/DesativarCategoria', async (req, res) => {

    const estabelecimentoId = req.query.IdEstabelecimento

    const {
        id,
        guid,
        idEmpresa,
        idEstabelecimento,
        ordem,
        nome,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const categoria = {
        id,
        guid,
        idEmpresa,
        idEstabelecimento,
        ordem,
        nome,
        ativo,
        dataCriacao,
        dataAtualizacao,
    }

    try {

        const updatedCategoria = await Categoria.updateOne({ _id: estabelecimentoId }, categoria)

        console.log(updatedCategoria)

        if (updatedCategoria.matchedCount === 0) {
            res.status(422).json({ message: 'A Categoria não foi encontrado!' })
            return
        }

        res.status(200).json({
            success: true,
            message: 'Categoria desativada!',
            data: categoria,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a categoria.',
            error: error
        })
    }

})

module.exports = router