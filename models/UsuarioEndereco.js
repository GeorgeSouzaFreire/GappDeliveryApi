const mongoose = require('mongoose')

const UsuarioEndereco  = mongoose.model('UsuarioEndereco', { 
    usuario: String,
    endereco: Object,
    entrega: Object,
})

module.exports = UsuarioEndereco