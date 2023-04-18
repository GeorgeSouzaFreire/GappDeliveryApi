const mongoose = require('mongoose')

const Empresa = mongoose.model('Empresa', {
    idEmpresa: Number,
    guid: String,
    razaoSocial: String,
    nomeFantasia: String,
    cnpj: String,
    endereco: Object,
    contato: Object,
    designer: Object,
    plano: Object,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = Empresa