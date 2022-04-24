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
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(idEmpresa).trim()) {
        errors.nome = ['O IdEmpresa é obrigatório'];
    }

    if (!String(idEndereco).trim()) {
        errors.nome = ['O IdEndereco é obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const empresaEndereco = {
            guid,
            idEmpresa,
            idUsuario,
            nomeUsuario,
            endereco,
            quantidade,
            formaPagamento,
            statusPedido,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        // Create
        try {

            // Criando dados
            const empresaEnderecoCreate = await EmpresaEndereco.create(empresaEndereco)

            res.status(201).json({
                success: true,
                message: "Relacionamento Empresa x Endereço criada com sucesso!",
                data: empresaEnderecoCreate,
            })

        } catch (error) {
            res.status(500).json({ success: false, error: error })
        }

    }

})

// GetImagem por IdProduto
router.get('/GetImagemPorIdProduto', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const guid = req.query.GUID
    const ordemId = req.query.Ordem

    try {

        Imagem.find({ guid: { $in: guid }, ordem: ordemId }).exec(function (err, lista) {
            if (err) {
                res.status(422).json({
                    success: false,
                    message: 'Não há imagem(s) cadastrada(s) para esse Produto.' + err,
                    data: [],
                })
            } else {

                lista.forEach((imagem) => {
                    imagem.base64 = new Buffer.from(imagem.imagem).toString('base64');
                    imagem.imagem = null
                });
                res.status(200).json({
                    success: true,
                    message: 'Foram encontrado ' + lista.length + ' imagen(s)!',
                    data: { lista },
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }


})

module.exports = router