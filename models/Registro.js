const mongoose = require('mongoose')

const Registro = mongoose.model('Registro', {    
    guid: String,
    empresa: Object,  
    funcionario: Object, 
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String          
})

module.exports = Registro