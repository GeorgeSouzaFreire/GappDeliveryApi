const mongoose = require('mongoose')

const EmpresaEndereco  = mongoose.model('EmpresaEndereco', {
    id: String,    
    idEmpresa: String,
    idEndereco: String,
})

module.exports = EmpresaEndereco