const mongoose = require('mongoose')

const EstabelecimentoFormaPagamento  = mongoose.model('EstabelecimentoFormaPagamento', {
    id: String,    
    idEstabelecimento: String,
    idFormaPagamento: String,
})

module.exports = EstabelecimentoFormaPagamento