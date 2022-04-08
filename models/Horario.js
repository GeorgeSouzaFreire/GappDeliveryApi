const mongoose = require('mongoose')

const Horario  = mongoose.model('Horario', {
    id: String,
    guid: String,
    semana: String,
    horarioInicio: String,
    horarioTermino: String,
    intervaloInicio: String,
    intervaloTermino: String,   
})

module.exports = Horario
