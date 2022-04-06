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
            res.status(500).json({ success: false, error: error })
        }

    }

})

module.exports = router