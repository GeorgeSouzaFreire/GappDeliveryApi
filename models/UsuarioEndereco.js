const mongoose = require('mongoose')

const UsuarioEndereco  = mongoose.model('UsuarioEndereco', { 
    usuario: Object,
    endereco: Object,
    entrega: Object,
})

module.exports = UsuarioEndereco