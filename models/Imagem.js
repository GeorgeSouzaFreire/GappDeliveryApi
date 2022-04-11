const mongoose = require('mongoose')

const Imagem  = mongoose.model('Imagem', {    
    guid: String,
    nome: String,
    imagem: Buffer   
})

module.exports = Imagem