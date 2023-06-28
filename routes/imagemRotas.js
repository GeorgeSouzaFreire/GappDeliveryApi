const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const Imagem = require('../models/Imagem')
const multer = require('multer')
const fileSystem = require('fs');
const upload = multer()


// Post - Criação de uma Nova Empresa
router.post('/PostImagem/:Empresa/:Categoria', async (req, res) => {

    const pathEmpresa = req.params.Empresa
    const pathCategoria = req.params.Categoria

    console.log('Pasta', pathEmpresa)
    console.log('Pasta', pathCategoria)

    // req.body   
    const {
        guid,
        nome,        
        ordem,
        base64,
        url
    } = req.body

    const errors = {};

    if (!String(guid).trim()) {
        errors.nome = ['GUID Obrigatório'];
    }

    if (Object.keys(errors).length) {
        res.status(422).json({ error: errors })
    } else {

        const imagem = {
            guid,
            nome,            
            ordem,
            base64,
            url
        }

        // Create
        try {

            console.log("Received file" + req.file.originalname);
            console.log("Received file" + req.file.path);

            var src = fileSystem.createReadStream(req.file.path);
            var dest = fileSystem.createWriteStream(path + req.file.originalname);
            src.pipe(dest);
            src.on('end', async () => {
                fs.unlinkSync(req.file.path);
                console.log('OK: received ' + req.file.originalname);

                // Criando dados
                const imagemCreate = await Imagem.create(imagem)

                res.status(201).json({
                    success: true,
                    message: "Imagem registrada com sucesso!",
                    data: imagemCreate,
                })

            });
            src.on('error', function (err) { res.json('Something went wrong!'); });



        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar as imagens.',
                error: error
            })
        }
    }
})

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