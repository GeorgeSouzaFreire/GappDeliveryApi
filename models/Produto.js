const mongoose = require('mongoose')

const Produto = mongoose.model('Produto', {
    id: Number,
    guid: String,
    idCategoria: String,
    precoAntigo: Number,
    precoAtual: Number,
    promocao: String,
    desconto: String,
    nome: String,
    parcela: String,
    descricao: String,   
    imagem: String,
    isExibeDesconto: Boolean,   
    isExibePromocao: Boolean,
    isExibePrecoAntigo: Boolean,   
    isExibeParcela: Boolean,
    ativo: String,   
    dataCriacao: String,
    dataAtualizacao: String,          
})

module.exports = Produto