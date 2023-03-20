const mongoose = require('mongoose')

const StatusPedido = mongoose.model('StatusPedido', {
    guid: String,
    idEmpresa: Number,
    nome: String,
    codigo: Number,
    ordem: Number,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = StatusPedido