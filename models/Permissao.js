const mongoose = require('mongoose')

const Permissao = mongoose.model('Permissao', {    
    nome: String,
    codigo: Number,  
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,          
})

module.exports = Permissao