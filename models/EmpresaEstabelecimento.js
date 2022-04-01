const mongoose = require('mongoose')

const EmpresaEstabelecimento  = mongoose.model('EmpresaEstabelecimento', {    
    idEndereco: Number,
    idEstabelecimento: Number,   
})

module.exports = EmpresaEstabelecimento