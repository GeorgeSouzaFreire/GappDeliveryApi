const mongoose = require('mongoose')

const EmpresaDesigner = mongoose.model('EmpresaDesigner', {
    id: Number,
    guid: String,
    idEmpresa: Number,
    imagemLogoLogin: Object,
    corBotaoLogin: String,
    corBotaoSemCadastro: String,
    corFundoLogin: String,
    imagemFundoLogin: Object,
    isImagemFundoLogin: Boolean,
    corToolbar: String,
    corBotaoAcao: String,
    corPrimariaFundoProduto: String,
    corSecundariaFundoProduto: String,
})

module.exports = EmpresaDesigner