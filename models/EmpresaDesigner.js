const mongoose = require('mongoose')

const EmpresaDesigner = mongoose.model('EmpresaDesigner', {
    id: Number,
    codigo: Number,
    guid: String,
    idEmpresa: Number, 
    imagem: Object,  
    corPrincipal: String,
    corSecundaria: String,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,
})

module.exports = EmpresaDesigner