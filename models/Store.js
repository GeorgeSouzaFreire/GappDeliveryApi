const mongoose = require('mongoose')

const Store = mongoose.model('Store', {   
    guid: String, 
    idEmpresa: Number,
    nomeApp: String,
    breveDescricao: String,
    descricaoCompleta: String,   
    imagem: Object,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = Store