const mongoose = require('mongoose')

const FormaPagamento = mongoose.model('FormaPagamento', {    
    guid: String,
    idEstabelecimento: String,    
    tipo: String,      
    idTipo: Number,  
    ordem: Number,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = FormaPagamento