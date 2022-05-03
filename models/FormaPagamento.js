const mongoose = require('mongoose')

const FormaPagamento = mongoose.model('FormaPagamento', {
    id: String,
    guid: String,    
    tipo: String,    
    ordem: Number
})

module.exports = FormaPagamento