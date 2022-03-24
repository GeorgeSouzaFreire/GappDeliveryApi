const mongoose = require('mongoose')

const Endereco  = mongoose.model('Endereco', {
    id: Number,
    logradouro: String,
    numero: Number,
    complemento: String,
    bairro: String,
    cep: String,
    cidade: String,
    latitude: Number,
    longitude: Number,
})

module.exports = Endereco