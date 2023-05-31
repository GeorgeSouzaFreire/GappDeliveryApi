const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria', {
    id: Number,
    guid: String,
    empresa: Object,
    estabelecimento: Object,
    ordem: Number,
    nome: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String, 
    produto:[],        
})

module.exports = Categoria