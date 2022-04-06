const mongoose = require('mongoose')

const EmpresaEstabelecimento  = mongoose.model('EmpresaEstabelecimento', {    
    idEmpresa: String,
    idEstabelecimento: String,   
})

module.exports = EmpresaEstabelecimento