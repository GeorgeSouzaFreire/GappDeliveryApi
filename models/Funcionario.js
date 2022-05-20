const mongoose = require('mongoose')

const Funcionario = mongoose.model('Funcionario', {
    nome: String,
    cargo: String,
    idEmpresa: Number,
    estabelecimento: Object,    
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,           
})

module.exports = Funcionario