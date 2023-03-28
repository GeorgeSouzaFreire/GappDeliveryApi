const mongoose = require('mongoose')

const Plano = mongoose.model('Plano', {    
    nome: String,
    codigo: Number,  
    valor: Number,
    isPlanoAtual: Boolean,
    quantidadeEstabelecimento: Number,
    quantidadeProduto: Number,
    quantidadeCategoria: Number,
    quantidadeImagem: Number,    
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,          
})

module.exports = Plano