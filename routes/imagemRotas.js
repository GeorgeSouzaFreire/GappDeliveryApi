const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Imagem = require('../models/Imagem')
const multer = require('multer')
const fileSystem = require('fs');
const Produto = require('../models/Produto')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = 'uploads/' + req.params.pasta + '/' + req.params.subpasta + '/';

        console.log(dir)

        if (!fileSystem.existsSync(dir)) {
            fileSystem.mkdirSync(dir, { recursive: true, mode: 0o777, });
        }

        cb(null, dir)
    },
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Post - Criação de uma Nova Empresa
router.post('/PostImagem/:pasta/:subpasta', upload.array("picture", 5), async (req, res) => {

    // Create PostImagem
    try {
        var dir = 'uploads/' + req.params.pasta + '/' + req.params.subpasta + '/'

        const {
            guid,            
        } = req.body;

        console.log(req.body)

        req.files.forEach(async (file, index) => {

            console.log("Received file" + file.originalname);
            var src = fileSystem.createReadStream(file.path);
            var dest = fileSystem.createWriteStream(dir + file.originalname);
            src.pipe(dest);
            src.on('end', async () => {

                fileSystem.unlinkSync(file.path);

                var key = req.body['key-' + index]

                const imagem = {
                    guid: guid,
                    ordem: key,
                    caminho: dir + file.originalname,
                    nome: file.originalname,
                    url: 'http://gappdelivery.com.br/' + dir + file.originalname
                }

                await Imagem.create(imagem)

            });
            src.on('error', function (err) {
                console.log(err);
            });

        });

        const imagem = await Imagem.find({ guid: guid });

        var imagemPrimaria = {};     
        var imagemSecundariaArray = new Array();

        imagem.forEach(async (imagem, index) => {

            if (imagem.ordem === '0') {
                imagemPrimaria = {imagem};
            } else {
                imagemSecundariaArray.push(imagem);
            }

        });      
        
        const produto = {
            imagemPrimaria : imagemPrimaria,
            imagemSecundaria : imagemSecundariaArray
        }

        console.log(produto);

        const produtoUpdateOne = await Produto.findByIdAndUpdate({ _id: Object(guid), ativo: true }, produto, { new: true })

        if (produtoUpdateOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Produto não foi encontrado!',
                data: null,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Atualização realizada com sucesso!',
                data: produtoUpdateOne,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }

})

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

router.get("/GetUploads", async (req, res) => {
    try {
        const { pathLike } = req.body;
        const readStream = fileSystem.createReadStream(pathLike);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }
});

// GetImagem por IdProduto
router.get('/GetImagemPorIdProduto', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const guid = req.query.GUID
    const ordemId = req.query.Ordem

    try {

        Imagem.find({ guid: { $in: guid }, ordem: ordemId }).exec(function (err, lista) {
            if (err) {
                res.status(422).json({
                    success: false,
                    message: 'Não há imagem(s) cadastrada(s) para esse Produto.' + err,
                    data: [],
                })
            } else {

                lista.forEach((imagem) => {
                    imagem.base64 = new Buffer.from(imagem.imagem).toString('base64');
                    imagem.imagem = null
                });
                res.status(200).json({
                    success: true,
                    message: 'Foram encontrado ' + lista.length + ' imagen(s)!',
                    data: { lista },
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }


})

module.exports = router