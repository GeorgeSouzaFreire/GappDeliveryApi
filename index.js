// config inicial
require('dotenv').config()
const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { default: mongoose } = require('mongoose')
const app = express()


// forma de ler JSON / middlewares

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//Rotas da API
//const personRoutes = require('./routes/personRoutes')
const usuarioRotas         = require('./routes/usuarioRotas')
const enderecoRotas        = require('./routes/enderecoRotas')
const usuarioEnderecoRotas = require('./routes/usuarioEnderecoRotas')
const empresaRotas         = require('./routes/empresaRotas')
const empresaEnderecoRotas = require('./routes/empresaEnderecoRotas')
const empresaDesignerRotas = require('./routes/empresaDesignerRotas')

//app.use('/person', personRoutes)
// Rota Usuario
app.use('/App/V1/Usuario', usuarioRotas)
app.use('/App/V1/Usuario', usuarioEnderecoRotas)

// Rota Endereco
app.use('/App/V1/Endereco', enderecoRotas)

// Rota Empresa
app.use('/App/V1/Empresa', empresaRotas)
app.use('/App/V1/Empresa', empresaEnderecoRotas)
app.use('/App/V1/Empresa', empresaDesignerRotas)


// Rota Inicial / endpoint 
/*app.get('/Atualizacao', (req, res) =>{  
    // mostrar req
    res.json({message: 'Oi Atualizacao!'})
})*/

// Entregar uma porta
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.dxszc.mongodb.net/GappDeliveryApiDatabase?retryWrites=true&w=majority`
)
.then(() =>{
    console.log('Conectamos ao MongoDB')
    app.listen(3000)
})
.catch((err) =>{
    console.log(err)
})

