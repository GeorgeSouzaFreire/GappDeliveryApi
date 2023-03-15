const mongoose = require('mongoose')

const Funcionario = mongoose.model('Funcionario', {
    nome: String,
    email: String,
    cargo: Object,
    empresa: Object,
    estabelecimento: Object, 
    permissao: Object,
    login: String,
    senha: String, 
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,           
})

module.exports = Funcionario