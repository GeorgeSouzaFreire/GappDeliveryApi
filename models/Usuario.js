const mongoose = require('mongoose')

const Usuario  = mongoose.model('Usuario', {
    id: String,
    guid: String,
    codigo: Number,
    empresa: Object,
    estabelecimento: Object,
    endereco: Object,
    imagem: Object,
    nome: String,
    telefone: String,
    email: String,
    senha: String,
    package: String,
    facebookDd: Number,
    googleId: Number,    
    web: Boolean,
    adminEmpresa: Boolean,
    adminMaster: Boolean,
    aceitaReceberInfo: Boolean,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,       
})

module.exports = Usuario