const mongoose = require('mongoose')

const EmpresaDesigner  = mongoose.model('EmpresaDesigner', {
    id: String,
    guid: String,
    logo: String,
    corPrimaria: String,
    corSecundaria: String,
    idEmpresa: String,  
})

module.exports = EmpresaDesigner