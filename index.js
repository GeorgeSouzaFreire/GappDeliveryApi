// config inicial
require('dotenv').config()
const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')


const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');

const cors = require('cors')
const { default: mongoose } = require('mongoose')
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// forma de ler JSON / middlewares
app.use(express.json({ limit: '50mb' }))
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    }),
)
app.set('port', process.env.PORT || 3000);

//app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public-flutter')));
app.use('/uploads', express.static(process.cwd() + '/uploads'))

//Rotas da API
//const personRoutes = require('./routes/personRoutes')
const utilRotas = require('./routes/utilRotas')
const usuarioRotas = require('./routes/usuarioRotas')
const enderecoRotas = require('./routes/enderecoRotas')
const empresaRotas = require('./routes/empresaRotas')
const empresaDesignerRotas = require('./routes/empresaDesignerRotas')
const estabelecimentoRotas = require('./routes/estabelecimentoRotas')
const categoriaEstabelecimentoRotas = require('./routes/categoriaEstabelecimentoRotas')
const categoriaRotas = require('./routes/categoriaRotas')
const imagemRotas = require('./routes/imagemRotas')
const pedidoRotas = require('./routes/pedidoRotas')
const funcionarioRotas = require('./routes/funcionarioRotas')
const planoEmpresaRotas = require('./routes/planoEmpresaRotas')


//app.use('/person', personRoutes)
// Rota Usuario
app.use('/Util', utilRotas)

app.use('/App/V1/Usuario', usuarioRotas)
app.use('/App/V1/Categoria', categoriaRotas)
app.use('/App/V1/Imagem', imagemRotas)
app.use('/App/V1/Empresa', empresaRotas)
app.use('/App/V1/Pedido', pedidoRotas)
app.use('/App/V1/Empresa', empresaDesignerRotas)
app.use('/App/V1/Endereco', enderecoRotas)
app.use('/App/V1/Estabelecimento', estabelecimentoRotas)

app.use('/Web/V1/Usuario', usuarioRotas)
app.use('/Web/V1/Endereco', enderecoRotas)
app.use('/Web/V1/Empresa', empresaRotas)
app.use('/Web/V1/Empresa', empresaDesignerRotas)
app.use('/Web/V1/Empresa', planoEmpresaRotas)
app.use('/Web/V1/Estabelecimento', estabelecimentoRotas)
app.use('/Web/V1/Categoria', categoriaEstabelecimentoRotas)
app.use('/Web/V1/Produto', categoriaRotas)
app.use('/Web/V1/Funcionario', funcionarioRotas)
app.use('/Web/V1/Pedido', pedidoRotas)
app.use('/Web/V1/Imagem', imagemRotas)



app.get('/api', (req, res) => {

    try {

        if (res.statusCode == 200) {
            res.status(res.statusCode).json({
                success: true,
                message: "Acesso a API realizado com sucesso! Todos os direitos reservados",
                data: {
                    Version: "Version 10.0.7",
                    Info: "Contact: application.gapp@gmail.com",
                    Update: 'Usuário Por Id'
                },
            })
        } else {
            res.status(res.statusCode).json({
                success: false,
                message: "Ops, Algo de errado ao acessar API",
                data: {},
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Acesso a API não autorizado!',
            error: err
        })
        // 👇️ This runs
        console.log('Error: ', err.message);
    }
})

// Entregar uma porta
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.dxszc.mongodb.net/GappDeliveryApiDatabase?retryWrites=true&w=majority`
).then(() => {
    console.log('Conectamos ao MongoDB')
    const server = app.listen(process.env.PORT)

    //Socket Logic
    const socketio = require('socket.io')(server)

    socketio.on("connection", (socket) => {
        console.log('conexão')
        socket.on('message', (data) => {
            console.log('message:', data);
            socket.emit('message', data); // Send the message to all connected clients            
            socket.broadcast.emit("message", data)
        })
        socket.on('disconnect', () => {
            console.log('desconectado');
        });
    })

}).catch((err) => {
    console.log(err)
})

