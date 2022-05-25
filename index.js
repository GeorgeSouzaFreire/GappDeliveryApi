// config inicial
require('dotenv').config()
const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { default: mongoose } = require('mongoose')
const app = express()


// forma de ler JSON / middlewares
app.use(express.json({ limit: '50mb' }))
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    }),
)
app.set('port', process.env.PORT || 3000);

app.use(express.json())

//Rotas da API
//const personRoutes = require('./routes/personRoutes')
const usuarioRotas         = require('./routes/usuarioRotas')
const enderecoRotas        = require('./routes/enderecoRotas')
const empresaRotas         = require('./routes/empresaRotas')
const empresaEnderecoRotas = require('./routes/empresaEnderecoRotas')
const empresaDesignerRotas = require('./routes/empresaDesignerRotas')
const estabelecimentoRotas = require('./routes/estabelecimentoRotas')
const categoriaEstabelecimentoRotas = require('./routes/categoriaEstabelecimentoRotas')
const categoriaProdutoRotas         = require('./routes/categoriaProdutoRotas')
const imagemRotas                   = require('./routes/imagemRotas')
const pedidoRotas                   = require('./routes/pedidoRotas')
const funcionarioRotas              = require('./routes/funcionarioRotas')

//app.use('/person', personRoutes)
// Rota Usuario
app.use('/App/V1/Usuario', usuarioRotas)
app.use('/App/V1/CategoriaProduto', categoriaProdutoRotas)
app.use('/App/V1/Imagem', imagemRotas)
app.use('/App/V1/Empresa', empresaRotas)
app.use('/App/V1/Pedido', pedidoRotas)
app.use('/App/V1/Empresa', empresaDesignerRotas)
app.use('/App/V1/Endereco', enderecoRotas)
app.use('/App/V1/Estabelecimento', estabelecimentoRotas)

app.use('/Web/V1/Usuario', usuarioRotas)
app.use('/Web/V1/Endereco', enderecoRotas)
app.use('/Web/V1/Empresa', empresaRotas)
app.use('/Web/V1/Empresa', empresaEnderecoRotas)
app.use('/Web/V1/Empresa', empresaDesignerRotas)
app.use('/Web/V1/Estabelecimento', estabelecimentoRotas)
app.use('/Web/V1/Categoria', categoriaEstabelecimentoRotas)
app.use('/Web/V1/Produto', categoriaProdutoRotas)
app.use('/Web/V1/Funcionario', funcionarioRotas)
,
app.get('/Api', (req, res) =>{  
   
    try {
        //const result = JSON.parse({'teste' : 'teste'});
        console.log('Status: ', res.statusCode);
        if (!res.statusCode == 200) {
            throw new Error(`Error status: ${res.status}`);
          }

        res.type('application/json');

        const result = JSON.parse( JSON.stringify({name: 'Tom'}));

        res.status(200).json(result)
      } catch (err) {
        // 👇️ This runs
        console.log('Error: ', err.message);
      }
})

// Entregar uma porta
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.dxszc.mongodb.net/GappDeliveryApiDatabase?retryWrites=true&w=majority`
)
.then(() =>{
    console.log('Conectamos ao MongoDB')
    app.listen(process.env.PORT)
})
.catch((err) =>{
    console.log(err)
})

