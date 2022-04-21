const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    idEstabelecimento: String,
    ordem: Number,
    nome: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String, 
    produto:[],        
})

module.exports = Categoria