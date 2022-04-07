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
const estabelecimentoRotas = require('./routes/estabelecimentoRotas')
const categoriaEstabelecimentoRotas = require('./routes/categoriaEstabelecimentoRotas')
const categoriaProdutoRotas         = require('./routes/categoriaProdutoRotas')


//app.use('/person', personRoutes)
// Rota Usuario
app.use('/Web/V1/Usuario', usuarioRotas)
app.use('/Web/V1/Usuario', usuarioEnderecoRotas)
app.use('/Web/V1/Endereco', enderecoRotas)
app.use('/Web/V1/Empresa', empresaRotas)
app.use('/Web/V1/Empresa', empresaEnderecoRotas)
app.use('/Web/V1/Empresa', empresaDesignerRotas)
//app.use('/Web/V1/Estabelecimento', estabelecimentoRotas)
app.use('/Web/V1/Categoria', categoriaEstabelecimentoRotas)
app.use('/Web/V1/Produto', categoriaProdutoRotas)
app.get('/', (req, res) =>{  
    // mostrar req
    res.json({message: 'Bem Vindo ao GappDelivery!'})
})

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

