const mongoose = require('mongoose')

const Contato = mongoose.model('Contato', {
    id: Number,
    guid: String,
    telefone: String,
    celular: String,
    email: String,
    responsavel: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String, 
        
})

module.exports = Contato