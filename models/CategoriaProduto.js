const mongoose = require('mongoose')

const CategoriaProduto = mongoose.model('CategoriaProduto', {    
    idProduto: String,
    idCategorria: String,   
})

module.exports = CategoriaProduto