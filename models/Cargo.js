const mongoose = require('mongoose')

const Cargo = mongoose.model('Cargo', {    
    nome: String,
    idEmpresa: Number,        
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,          
})

module.exports = Cargo