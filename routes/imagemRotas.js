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
        /*const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };*/
    },
});

const upload = multer({ storage });

// Post - Criação de uma Nova Empresa
router.post('/PostImagem/:pasta/:subpasta', upload.array("picture", 5), async (req, res) => {

    const {
        guid,
        ordem,
    } = req.body;

    console.log("Body", req.body);
    console.log(req.files);

    // Create
    try {
        var dir = 'uploads/' + req.params.pasta + '/' + req.params.subpasta + '/'

        req.files.forEach(async (file) => {            

        console.log("Received file" + file.originalname);
        var src = fileSystem.createReadStream(file.path);
        var dest = fileSystem.createWriteStream(dir + file.originalname);
        src.pipe(dest);
        src.on('end', async () => {

            fileSystem.unlinkSync(file.path);

            const imagem = {
                guid: guid,
                caminho: dir + file.originalname,
                nome: file.originalname,
                url: 'http://gappdelivery.com.br/' + dir + file.originalname
            }

            var produto;

            if (ordem === '0') {
                const imagemPrimaria = await Imagem.create(imagem)
                produto = {
                    imagemPrimaria: imagemPrimaria,
                }
            } else {
                const imagemSecundaria = await Imagem.create(imagem)
                produto = {
                    imagemSecundaria: imagemSecundaria
                }
            }

            console.log("Produto" + produto);

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

        });
        src.on('error', function (err) {
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar as imagens.',
                error: err
            })
        });

    });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }

})

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