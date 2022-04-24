const mongoose = require('mongoose')

const FormaPagamento = mongoose.model('FormaPagamento', {
    guid: String,
    nome: String,
    imagem: Buffer,
    ordem: Number
})

module.exports = FormaPagamento