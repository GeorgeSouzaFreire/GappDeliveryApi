const mongoose = require('mongoose')

const Funcionario = mongoose.model('Funcionario', {
    nome: String,
    email: String,
    cargo: String,
    idCargo: String,
    idEmpresa: Number,
    estabelecimento: Object, 
    permissao: Object,
    login: String,
    senha: String, 
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,           
})

module.exports = Funcionario