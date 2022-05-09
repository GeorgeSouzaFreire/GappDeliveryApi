const mongoose = require('mongoose')

const EstabelecimentoFormaPagamento  = mongoose.model('EstabelecimentoFormaPagamento', {
    id: String,    
    idEstabelecimento: String,
    idFormaPagamento: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = EstabelecimentoFormaPagamento