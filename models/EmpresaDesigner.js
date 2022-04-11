const mongoose = require('mongoose')

const EmpresaDesigner = mongoose.model('EmpresaDesigner', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    logoLoginPrincipal: String,
    corBotaoLogin: String,
    corBotaoSemCadastro: String,
    corFundoLogin: String,
    imagemFundoLogin: String,
    isImagemFundoLogin: Boolean,
    corToolbar: String,
    corBotaoAcao: String,
    corPrimariaFundoProduto: String,
    corSecundariaFundoProduto: String,
})

module.exports = EmpresaDesigner