const mongoose = require('mongoose')

const EstabelecimentoEndereco  = mongoose.model('EstabelecimentoEndereco', {
    id: String,    
    idEstabelecimento: String,
    idEndereco: String,
})

module.exports = EstabelecimentoEndereco