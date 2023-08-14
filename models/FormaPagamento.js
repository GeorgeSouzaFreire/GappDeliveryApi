const mongoose = require('mongoose')

const FormaPagamento = mongoose.model('FormaPagamento', {    
    guid: String,      
    tipo: String,      
    idTipo: Number,  
    ordem: Number,
    observacao: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String
})

module.exports = FormaPagamento