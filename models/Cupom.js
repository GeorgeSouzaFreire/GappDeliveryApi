const mongoose = require('mongoose')

const Cupom = mongoose.model('Cupom', {
    id: Number,
    guid: String,
    empresa: Object,
    estabelecimento: Object,
    ordem: Number,
    tipoDesconto: String,
    inicio: String,
    expirar: String,
    desconto: Number,
    indenticador: String,
    nome: String,
    regras: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,            
})

module.exports = Cupom