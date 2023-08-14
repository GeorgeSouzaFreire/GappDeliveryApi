const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Empresa = require('../models/Empresa')
const Estabelecimento = require('../models/Estabelecimento')
const Endereco = require('../models/Endereco')
const EstabelecimentoEndereco = require('../models/EstabelecimentoEndereco')
const EmpresaEstabelecimento = require('../models/EmpresaEstabelecimento')
const HorarioEstabelecimento = require('../models/HorarioEstabelecimento')
const Horario = require('../models/Horario')
const FormaPagamento = require('../models/FormaPagamento')
const EstabelecimentoFormaPagamento = require('../models/EstabelecimentoFormaPagamento')
const Cupom = require('../models/Cupom')
const Imagem = require('../models/Imagem')
const Usuario = require('../models/Usuario')
const Mongoose = require('mongoose')
const TaxaEntrega = require('../models/TaxaEntrega')

// Post - Criação de uma Nova Empresa
router.post('/PostEstabelecimento/', async (req, res) => {

    // req.body   
    const {
        id,
        guid,
        empresa,
        imagem,
        nome,
        tipoEstabelecimento,
        cnpj,
        endereco,
        taxaEntrega,
        horario,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome obrigatório'];
    }

    if (!String(endereco.cep).trim()) {
        errors.cep = ['CEP obrigatório'];
    }

    if (!String(cnpj).trim()) {
        errors.cnpj = ['CNPJ obrigatório'];
    }

    if (!String(telefone1).trim()) {
        errors.telefone = ['Telefone obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const estabelecimento = {
            id,
            guid,
            empresa,
            imagem,
            nome,
            tipoEstabelecimento,
            cnpj,
            endereco,
            taxaEntrega,
            horario,
            telefone1,
            telefone2,
            telefone3,
            facebook,
            instagram,
            whatsapp,
            ativo,
            dataCriacao,
            dataAtualizacao
        }


        try {

            // Create Estabelecimento
            const estabelecimentoCreate = await Estabelecimento.create(estabelecimento)

            // Criando a Horario   
            const horarios = estabelecimento.horario;

            horarios.forEach(async (horario) => {

                try {
                    const horarioCreate = await Horario.create(horario)
                } catch (error) {
                    console.log('Array Horario', error);
                }

            });

            res.status(200).json({
                success: true,
                message: "Estabelecimento cadastrado com sucesso!",
                data: estabelecimentoCreate,
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Não foi possivel registrar o Estabelecimento!",
                error: error
            })
        }

    }

})

// GetEstabelecimentoPorIdEmpresa por IdEmpresa
router.get('/GetEstabelecimentoPorIdEmpresa', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const empresaId = req.query.IdEmpresa

    try {

        const estabelecimentos = await Estabelecimento.find({ "empresa.idEmpresa": Number.parseInt(empresaId) })

        estabelecimentos.forEach(async function (estabelecimento) {

            try {

                const empresa = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

                estabelecimento.empresa = empresa

                console.log(estabelecimento._id)

                const imagem = await Imagem.findOne({ guid: estabelecimento._id })

                estabelecimento.imagem = imagem

                //console.log(imagem._id)

                const taxa = await TaxaEntrega.findOne({ 'estabelecimento._id': estabelecimento._id })

                estabelecimento.taxa = taxa

                const estabelecimentoUpdateOne = await Estabelecimento.updateOne({ _id: estabelecimento._id }, estabelecimento, { new: true })

            } catch (error) {
                console.log('Array Update Estabelecimento', error);
            }

        });

        if (estabelecimentos == null) {
            res.status(422).json({
                success: false,
                message: 'O Estabelecimento não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado ' + estabelecimentos.length + ' resultado(s) cadastrado!',
                data: estabelecimentos,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel registrar o Estabelecimento!",
            error: error
        })
    }

})

// Get Cupom 
router.get('/GetCupom', async (req, res) => {

    const estabelecimentoId = req.query.IdEstabelecimento
    const ativo = req.query.Ativo
    const cupom = req.query.Cupom

    try {

        console.log('Id do Estabelecimento!', estabelecimentoId)

        const cupomFindOne = await Cupom.findOne({ 'estabelecimento._id': estabelecimentoId, indenticador: cupom, ativo: ativo })

        if (cupomFindOne === null) {
            res.status(422).json({
                success: false,
                message: 'Cupom Inválido ou expirado.',
                data: cupomFindOne,
            })
        } else {
            res.status(200).json({
                success: true,
                message: cupomFindOne.regras,
                data: cupomFindOne,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel realizar a busca do Cupom!",
            error: error
        })
    }

})

// Resgatar Forma de Pagamento Ativa
router.get('/GetFormaPagamentoAtiva', async (req, res) => {

    const ativo = req.query.Ativo

    try {

        const formaDePagamentoFind = await FormaPagamento.find({ ativo: ativo })

        if (formaDePagamentoFind.length === 0) {
            res.status(422).json({
                success: false,
                message: 'Não há Forma de Pagamento cadastrado!',
                data: formaDePagamentoFind,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontradas ' + formaDePagamentoFind.length + ' formas de pagamentos cadastradas!',
                data: formaDePagamentoFind,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel realizar a busca da Forma de Pagamento!",
            error: error
        })
    }

})

// Resgatar Forma de Pagamento 
router.get('/GetFormaPagamento', async (req, res) => {

    const estabelecimentoId = req.query.IdEstabelecimento
    const ativo = req.query.Ativo

    try {

        console.log('Id do Estabelecimento!', estabelecimentoId)

        const formaDePagamentoFind = await FormaPagamento.find({ idEstabelecimento: estabelecimentoId, ativo: ativo })

        if (formaDePagamentoFind.length === 0) {
            res.status(422).json({
                success: false,
                message: 'Não há Forma de Pagamento cadastrado!',
                data: formaDePagamentoFind,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontradas ' + formaDePagamentoFind.length + ' formas de pagamentos cadastradas!',
                data: formaDePagamentoFind,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel realizar a busca da Forma de Pagamento!",
            error: error
        })
    }

})

// Resgatar Taxa de Entrega 
router.get('/GetTaxaEntrega', async (req, res) => {

    const estabelecimentoId = req.query.IdEstabelecimento

    try {

        console.log('Id do Estabelecimento!', estabelecimentoId)

        const taxaEntregaFindOne = await TaxaEntrega.findOne({ 'estabelecimento._id': estabelecimentoId })

        if (taxaEntregaFindOne === null) {
            res.status(422).json({
                success: false,
                message: 'Não há Taxa de Entrega cadastrado!',
                data: taxaEntregaFindOne,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Taxa de Entrega encontrada com sucesso!',
                data: taxaEntregaFindOne,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possivel realizar a busca da Taxa de Entrega!",
            error: error
        })
    }

})

// Post Forma de Pagamento 
router.post('/PostFormaPagamento', async (req, res) => {

    try {

        req.body.forEach(async function (item) {

            const {
                guid,
                idEstabelecimento,
                tipo,
                idTipo,
                ordem,
                ativo,
                dataCriacao,
                dataAtualizacao,
            } = item

            const formaPagamento = {
                guid,
                idEstabelecimento,
                tipo,
                idTipo,
                ordem,
                ativo,
                dataCriacao,
                dataAtualizacao,
            }

            // Criando dados Forma de Pagamento
            const formaPagamentoCreate = await FormaPagamento.create(formaPagamento)

            console.log('Forma de Pagamento criada com sucesso!', formaPagamentoCreate)

            console.log(formaPagamento)
        })

        res.status(200).json({
            success: true,
            message: 'Forma de Pagamento registrada com sucesso!',
            data: req.body,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível registrar o Forma de Pagamento!",
            error: error
        })
    }

})

// Post Post Taxa Entrega 
router.post('/PostTaxaEntrega', async (req, res) => {

    try {

        const {
            guid,
            empresa,
            estabelecimento,
            valor,
            titulo,
            descricao,
            ativo,
            dataCriacao,
            dataAtualizacao,
        } = req.body

        const taxaEntrega = {
            guid,
            empresa,
            estabelecimento,
            valor,
            titulo,
            descricao,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        const taxaEntregaFindOne = await TaxaEntrega.findOne({ 'estabelecimento._id': estabelecimento._id })

        if (taxaEntregaFindOne === null) {
            // Criando dados TaxaEntrega
            const taxaEntregaCreate = await TaxaEntrega.create(taxaEntrega)

            console.log('Taxa de entrega criada com sucesso!', taxaEntregaCreate)

            res.status(200).json({
                success: true,
                message: 'Taxa de entrega registrada com sucesso!',
                data: taxaEntregaCreate,
            })
        } else {
            // Criando dados TaxaEntrega
            const taxaEntregaUpdateOne = await TaxaEntrega.updateOne({ _id: taxaEntregaFindOne._id }, taxaEntrega, { new: true })

            res.status(200).json({
                success: true,
                message: 'Taxa de entrega atualizada com sucesso!',
                data: taxaEntregaUpdateOne,
            })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível registrar o Taxa de Entrega!" + error,
            error: error
        })
    }

})

// Create 
router.patch('/AtualizarFormaPagamentoEstabelecimento', async (req, res) => {

    try {

        const estabelecimentoId = req.query.IdEstabelecimento

        const formaPagamentos = req.body

        var updates = await Promise.all(formaPagamentos.map(async (item) => {

            console.log(item)

            const {
                guid,
                tipo,
                idTipo,
                ordem,
                observacao,
                ativo,
                dataCriacao,
                dataAtualizacao
            } = item

            const formaPagamento = {
                guid,
                tipo,
                idTipo,
                ordem,
                observacao,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const estabelecimento = await Estabelecimento.updateOne({ _id: estabelecimentoId }, { $push: { 'formaPagamento': formaPagamento } }, { new: true })

            console.log(' Promise.all Está no loop', estabelecimento)

            return estabelecimento;
        }));

        if (updates == null) {
            res.status(422).json({
                success: false,
                message: 'Não há atualização para o estabelecimento!',
                data: {},
            })
        } else {
            const estabelecimento = await Estabelecimento.findOne({ _id: estabelecimentoId });

            console.log('Then Saiu do loop', estabelecimento)
    
            res.status(200).json({
                success: true,
                message: 'Estabelecimento atualizado com sucesso!',
                data: estabelecimento,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Não foi possível atualizar a Forma de Pagamento!",
            error: error
        })
    }

})

// Put - Estabelecimento
router.patch('/:idEstabelecimento', async (req, res) => {

    const estabelecimentoId = req.params.idEstabelecimento

    const {
        id,
        guid,
        idEmpresa,
        nome,
        endereco,
        horario,
        icone,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const estabelecimento = {
        id,
        guid,
        idEmpresa,
        nome,
        endereco,
        horario,
        icone,
        telefone1,
        telefone2,
        telefone3,
        facebook,
        instagram,
        whatsapp,
        ativo,
        dataCriacao,
        dataAtualizacao
    }

    try {

        // Update no Endereço
        const estabelecimentoEnderecoFindOne = await EstabelecimentoEndereco.findOne({ idEstabelecimento: estabelecimentoId })
        console.log('Json {} de EstabelecimentoEndereco findOne', estabelecimentoEnderecoFindOne)
        const enderecoUpdateOne = await Endereco.updateOne({ _id: estabelecimentoEnderecoFindOne.idEndereco.String }, estabelecimento.enredeco)
        console.log('Json {} de Endereço UpdateOne', enderecoUpdateOne)

        // Update no Horario
        const horarios = estabelecimento.horario;

        horarios.forEach(async (horario) => {

            try {

                // Buscando a HorarioEstabelecimento                
                const estabelecimentoHorarioFindOne = await HorarioEstabelecimento.findOne({ idEstabelecimento: estabelecimentoId })

                const horarioCreate = await Horario.updateOne({ _id: estabelecimentoHorarioFindOne.idHorario.String }, horario)
                console.log('Json {} de Horario UpdateOne', horarioCreate)

            } catch (error) {
                console.log('Array Horario', error);
            }

        });

        const updatedEstabelecimento = await Estabelecimento.updateOne({ _id: estabelecimentoId }, estabelecimento)

        if (updatedEstabelecimento.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram atualizado(s) ' + estabelecimento.length + ' resultado(s) cadastrado!',
                data: estabelecimento,
            })
        }


    } catch (error) {
        console.log('Erro - 500', error);
        res.status(500).json({ error: error })
    }

})


module.exports = router