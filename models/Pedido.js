const mongoose = require('mongoose')

const Pedido = mongoose.model('Pedido', {
    guid: String,
    idEmpresa: Number,   
    idUsuario: String,
    nomeUsuario: String,    
    endereco: Object,
    quantidade: Object,
    formaPagamento: Object,
    statusPedido: String,
    ativo: String,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = Pedido