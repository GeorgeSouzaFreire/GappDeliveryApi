const mongoose = require('mongoose')

const CategoriaEstabelecimento = mongoose.model('CategoriaEstabelecimento', {    
    idEmpresa: String,
    idCategorria: String,   
})

module.exports = CategoriaEstabelecimento