const mongoose = require('mongoose')

const Empresa  = mongoose.model('Empresa', {
    id: Number,
    guid: String,
    nome: String,
    nomeFantasia: String,
    cnpj: String,
    endereco: Object,
    telefoneFixo: String,
    celular: String,
    email: String,     
    designer: Object,    
})

module.exports = Empresa