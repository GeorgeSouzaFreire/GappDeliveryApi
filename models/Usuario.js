const mongoose = require('mongoose')

const Usuario  = mongoose.model('Usuario', {
    id: String,
    guid: String,
    idEmpresa: Number,
    idEstabelecimento: String,
    nome: String,
    telefone: String,
    email: String,
    senha: String,
    facebookDd: Number,
    googleId: Number,
    idUsuarioEndereco: Number,
    web: Boolean,
    adminEmpresa: Boolean,
    adminMaster: Boolean,
    aceitaReceberInfo: Boolean,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,       
})

module.exports = Usuario