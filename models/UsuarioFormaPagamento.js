const mongoose = require('mongoose')

const UsuarioFormaPagamento  = mongoose.model('UsuarioFormaPagamento', { 
    usuario: String,
    formaPagamento: Object,
    pagamento: Object,
})

module.exports = UsuarioFormaPagamento