const mongoose = require('mongoose')

const UsuarioEndereco  = mongoose.model('UsuarioEndereco', {
    id: Number,
    idUsuario: Number,
    idEndereco: Number,
})

module.exports = UsuarioEndereco