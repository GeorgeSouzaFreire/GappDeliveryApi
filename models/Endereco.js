const mongoose = require('mongoose')

const Endereco  = mongoose.model('Endereco', {
    id: Number,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cep: String,
    cidade: String,
    latitude: Number,
    longitude: Number,
    principal: Boolean,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = Endereco