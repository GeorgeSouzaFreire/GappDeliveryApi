const mongoose = require('mongoose')

const Estabelecimento = mongoose.model('Estabelecimento', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    nome: String,
    endereco: Object,
    horario: Object,
    icone: String,
    telefone1: String,
    telefone2: String,
    telefone3: String,
    facebook: String,
    instagram: String,
    whatsapp: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,
})

module.exports = Estabelecimento