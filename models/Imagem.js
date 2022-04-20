const mongoose = require('mongoose')

const Imagem  = mongoose.model('Imagem', {    
    guid: String,
    nome: String,
    imagem: Buffer,
    ordem: Number,
    base64: String
})

module.exports = Imagem