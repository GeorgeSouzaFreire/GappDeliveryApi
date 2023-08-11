const mongoose = require('mongoose')

const Estabelecimento = mongoose.model('Estabelecimento', {
    id: Number,
    guid: String,
    empresa: Object,
    imagem: Object,
    nome: String,
    tipoEstabelecimento: String,
    cnpj: String,    
    endereco: Object,
    formaPagamento: Object,
    taxa: Object,
    horario: Object,
    telefone1: String,
    telefone2: String,
    telefone3: String,
    facebook: String,
    instagram: String,
    whatsapp: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,
})

module.exports = Estabelecimento