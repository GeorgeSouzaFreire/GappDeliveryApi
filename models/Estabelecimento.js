const mongoose = require('mongoose')

const Estabelecimento  = mongoose.model('Estabelecimento', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    nome: String,
    idEndereco: Number,
    logo: String,
    idHorarioEstabelecimento: Number,
    statusFuncionamento: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,
})

module.exports = Estabelecimento