const mongoose = require('mongoose')

const Empresa  = mongoose.model('Empresa', {
    id: Number,
    guid: String,
    nome: String,
    nomeFantasia: String,
    cnpj: String,
    cep: String,
    telefoneFixo: String,
    celular: String,
    email: String,     
})

module.exports = Empresa