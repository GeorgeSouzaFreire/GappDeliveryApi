const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    idEstabelecimento: String,
    nome: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,         
})

module.exports = Categoria