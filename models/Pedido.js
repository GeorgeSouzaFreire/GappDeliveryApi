const mongoose = require('mongoose')

const Pedido = mongoose.model('Pedido', {
    guid: String,
    idEmpresa: Number,  
    idEstabelecimento: String, 
    idUsuario: String,
    nomeUsuario: String,    
    endereco: Object,
    item: Object,
    formaPagamento: Object,
    statusPedido: String,
    idStatusPedido: Number,
    observacao: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = Pedido