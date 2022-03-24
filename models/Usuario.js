const mongoose = require('mongoose')

const Usuario  = mongoose.model('Usuario', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    idEstabelecimento: Number,
    nome: String,
    sobrenome: String,
    telefone : String,
    email: String,
    facebookDd: Number,
    googleId: Number,
    idUsuarioEndereco: Number,
    web: Boolean,
    adminEmpresa: Boolean,
    adminMaster: Boolean,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,       
})

module.exports = Usuario