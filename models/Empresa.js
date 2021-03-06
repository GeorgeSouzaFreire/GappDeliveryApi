const mongoose = require('mongoose')

const Empresa  = mongoose.model('Empresa', {
    idEmpresa: Number,
    guid: String,
    nome: String,   
    cnpj: String,
    endereco: Object,
    telefone: String,
    celular: String,
    email: String,     
    designer: Object,   
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String 
})

module.exports = Empresa