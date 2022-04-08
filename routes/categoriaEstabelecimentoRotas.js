const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Categoria = require('../models/Categoria')
const CategoriaEstabelecimento = require('../models/CategoriaEstabelecimento')
const Estabelecimento = require('../models/Estabelecimento')

// Post - Criação de uma Nova Empresa
router.post('/PostCategoria/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        idEmpresa,
        idEstabelecimento,
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
                idEmpresa,
                idEstabelecimento,
                ordem,
                nome,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            // Buscando o Estabelecimento
            const estabelecimento = await Estabelecimento.findOne({ _id: idEstabelecimento })
            //***********/
            //console.log('Json {} de Estabelecimento', estabelecimento);
            if (estabelecimento == null) {

                res.status(404).json({
                    success: true,
                    message: "Id Estabelecimento não encontrado!",
                    data: {},
                })

            } else {

                // Criando a Categoria
                const categoriaCreate = await Categoria.create(categoria)
                console.log('Json {} de Categoria', categoriaCreate)
                //***********/

                // Criando a Categoria * Estabelecimento
                const categoriaEstabelecimento = {
                    idEstabelecimento: estabelecimento._id,
                    idCategoria: categoriaCreate._id
                };
                const categoriaEstabelecimentoCreate = await CategoriaEstabelecimento.create(categoriaEstabelecimento)
                console.log('Json {} de Relacionamento Categoria * Estabelecimento', categoriaEstabelecimentoCreate)
                //***********/

                res.status(201).json({
                    success: true,
                    message: "Categoria criada com sucesso!",
                    data: categoriaCreate,
                })



            }


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
router.get('/GetCategoriaPorIdEstabelecimento/:IdEstabelecimento', async (req, res) => {

    //console.log(req)

    // extrair o dado da requisição, pela url = req.params
    const id = req.params.IdEstabelecimento

    try {

        const categoria = await Categoria.find({ idEstabelecimento: id })

        console.log(categoria)

        if (categoria == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + categoria.length + ' resultado(s) cadastrado!',
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

module.exports = router