const mongoose = require('mongoose')

const TaxaEntrega = mongoose.model('TaxaEntrega', {
    id: Number,
    guid: String,
    empresa: Object,
    estabelecimento: Object,    
    valor: String,    
    titulo: String,
    descricao: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,            
})

module.exports = TaxaEntrega