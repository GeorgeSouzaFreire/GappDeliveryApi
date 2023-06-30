const mongoose = require('mongoose')

const Imagem = mongoose.model('Imagem', {
    guid: String,
    nome: String,
    caminho: String,
    imagem: Buffer,
    ordem: String,
    base64: String,
    url: String,
})

module.exports = Imagem