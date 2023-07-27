const mongoose = require('mongoose')

const Horario = mongoose.model('Horario', {
    id: String,
    guid: String,
    semana: String,
    idSemana: Number,
    horarioInicio: String,
    horarioTermino: String,
    intervaloInicio: String,
    intervaloTermino: String,
    status: Boolean,
    ativo: Boolean,
    dataCriacao: String,
    dataAtualizacao: String,
})

module.exports = Horario
