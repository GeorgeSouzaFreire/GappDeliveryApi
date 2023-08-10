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

        if (!fileSystem.existsSync(dir)) {
            fileSystem.mkdirSync(dir, { recursive: true, mode: 0o777, });
        }

        cb(null, dir)
    },
    //options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Post - Criação de uma Nova Empresa
router.post('/PostArraysImagem/:pasta/:subpasta', upload.array("picture", 5), async (req, res) => {

    // Create PostImagem
    try {
        var dir = 'uploads/' + req.params.pasta + '/' + req.params.subpasta + '/'

        const {
            guid,
        } = req.body;

        var imagemSecundariaArray = [];

        req.files.forEach(async (file, index) => {

            var src = fileSystem.createReadStream(file.path);
            var dest = fileSystem.createWriteStream(dir + file.originalname);
            src.pipe(dest);
            src.on('end', async function () {

                fileSystem.unlinkSync(file.path);

                var key = req.body['key-' + index]

                console.log('Key-', index);

                const imagem = {
                    guid: guid,
                    ordem: key,
                    caminho: dir + file.originalname,
                    nome: file.originalname,
                    url: 'http://gappdelivery.com.br/' + dir + file.originalname
                }

                const imagemCreate = await Imagem.create(imagem)

                if (imagemCreate.ordem === '0') {
                    const produto = { imagemPrimaria: imagemCreate }
                    const produtoUpdateOne = await Produto.updateOne({ _id: Object(guid) }, produto, { new: true })
                    console.log('Primaria --> ' + imagemCreate.ordem);
                } else {
                    console.log('Secundaria --> ' + imagemCreate.ordem);
                    imagemSecundariaArray.push(imagemCreate);

                    console.log('SecundariaArray ---> ' + imagemSecundariaArray);

                    const produto = { imagemSecundaria: imagemSecundariaArray }
                    const produtoUpdateSecundaria = await Produto.updateOne({ _id: Object(guid) }, produto, { new: true })
                    console.log(produtoUpdateSecundaria);
                }

            });
            src.on('error', function (err) {
                console.log(err);
            });

        });

        const produtoUpdateOne = await Produto.findOne({ _id: Object(guid) })

        if (produtoUpdateOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Produto não foi encontrado!',
                data: null,
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Registro realizada com sucesso!',
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

// Post - Criação de uma Nova Empresa
router.post('/PostImagem/:pasta/:subpasta', upload.array("picture", 5), async (req, res) => {

    // Create PostImagem
    try {
        var dir = 'uploads/' + req.params.pasta + '/' + req.params.subpasta + '/'

        const {
            guid,
        } = req.body;

        var imagemSecundariaArray = [];

        req.files.forEach(async (file, index) => {

            var src = fileSystem.createReadStream(file.path);
            var dest = fileSystem.createWriteStream(dir + file.originalname);
            src.pipe(dest);
            src.on('end', async function () {

                fileSystem.unlinkSync(file.path);

                var key = req.body['key-' + index]

                console.log('Key-', index);

                const imagem = {
                    guid: guid,
                    ordem: key,
                    caminho: dir + file.originalname,
                    nome: file.originalname,
                    url: 'http://gappdelivery.com.br/' + dir + file.originalname
                }

                const imagemCreate = await Imagem.create(imagem)

                if (imagemCreate.ordem === '0') {
                    console.log('Primaria --> ' + imagemCreate.ordem);
                } else {
                    console.log('Secundaria --> ' + imagemCreate.ordem);
                    imagemSecundariaArray.push(imagemCreate);
                    console.log('SecundariaArray ---> ' + imagemSecundariaArray);
                }

            });
            src.on('error', function (err) {
                console.log(err);
            });

        });

        const imagens = await Imagem.find({ guid: { $in: guid } })

        if (imagens.length == 0) {
            res.status(422).json({
                success: true,
                message: 'Atualização não realizada!',
                data: {},
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Atualização realizada com sucesso!',
                data: {},
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

// GetImagem por GUID
router.get('/GetImagemPorGuid', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const guid = req.query.GUID

    try {

        const imagens = await Imagem.find({ guid: { $in: guid } })

        if (imagens.length == 0) {
            res.status(422).json({
                success: false,
                message: 'Não há imagem(s) cadastrada(s) para esse Produto.' + err,
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Foram encontrado(s) ' + imagens.length + ' imagen(s)!',
                data: imagens,
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }


})

router.delete('/DeleteImagemPorGuid', async (req, res) => {

    // extrair o dado da requisição, pela url = req.params
    const guid = req.query.GUID

    try {

        const imagensDelete = await Imagem.find({ guid: { $in: guid } })

        if (imagensDelete.length == 0) {
            res.status(422).json({
                success: false,
                message: 'Não há imagem(s) cadastrada(s).',
                data: {},
            })
        } else {

            imagensDelete.forEach(async (imagem) => {
                try {
                    console.log('Caminho', imagem.caminho);
                    if (fileSystem.existsSync(imagem.caminho)) {
                        fileSystem.unlinkSync(imagem.caminho, async function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                                await Imagem.deleteOne({ _id: imagem._id })
                            }
                        });
                    } else {
                        console.log('File existsSync!');
                    }

                } catch (error) {
                    console.log('Imagem', error);
                }
            });

            const imagensFind = await Imagem.find({ guid: { $in: guid } })

            if (imagensFind.length == 0) {
                res.status(200).json({
                    success: true,
                    message: 'Imagens excluida com sucesso!',
                    data: imagensFind,
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Não foi possível excluir imagens!',
                    data: imagensFind,
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar as imagens.',
            error: error
        })
    }

})

module.exports = router