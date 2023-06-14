const mongoose = require('mongoose')

const ConfiguracaoDesign = mongoose.model('ConfiguracaoDesign', {
    codigo: Number,    
    nome: String,
    descricao: String,
    hexa: String,    
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String, 
        
})

module.exports = ConfiguracaoDesign