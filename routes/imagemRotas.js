const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Imagem = require('../models/Imagem')
const multer = require('multer')
const fileSystem = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = 'uploads/' + req.params.folderOne + '/' + req.params.folderTwo + '/';

        console.log(dir)

        if (!fileSystem.existsSync(dir)) {
            fileSystem.mkdirSync(dir, { recursive: true, mode: 0o777, });
        }

        cb(null, dir)
    },
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

const upload = multer({ storage });

// Post - Criação de uma Nova Empresa
router.post('/PostImagem/:folderOne/:folderTwo', upload.single("picture"), async (req, res) => {

    const {
        guid,        
        ordem,
    } = req.body;

    // Create
    try {
        var dir = 'uploads/' + req.params.folderOne + '/' + req.params.folderTwo + '/'

        console.log("Received file" + req.file.originalname);
        var src = fileSystem.createReadStream(req.file.path);
        var dest = fileSystem.createWriteStream(dir + req.file.originalname);
        src.pipe(dest);
        src.on('end', async () => {

            fileSystem.unlinkSync(req.file.path);
         
            const imagem = {
                guid: guid,
                caminho: dir + req.file.originalname,
                nome : req.file.originalname,                        
                url : 'http://gappdelivery.com.br/'+ dir + req.file.originalname
            }

            const imagemCreate = await Imagem.create(imagem)

            res.status(200).json({
                success: true,
                message: "Imagem registrada com sucesso!",
                data: imagemCreate,
            })
        });
        src.on('error', function (err) {
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar as imagens.',
                error: err
            })            
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
        const {pathLike} = req.body;
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