const mongoose = require('mongoose')

const Imagem  = mongoose.model('Imagem', {    
    guid: String,
    nome: String,
    imagem: Buffer,
    ordem: Number
})

module.exports = Imagem