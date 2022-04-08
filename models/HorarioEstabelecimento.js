const mongoose = require('mongoose')

const HorarioEstabelecimento  = mongoose.model('HorarioEstabelecimento', {       
    idEstabelecimento: String,
    idHorario: String,
})

module.exports = HorarioEstabelecimento
