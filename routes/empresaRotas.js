const router = require('express').Router()

const { response } = require('express')
const { get } = require('express/lib/response')
const { Int32 } = require('mongodb')
const Empresa = require('../models/Empresa')
const Endereco = require('../models/Endereco')
const Designer = require('../models/EmpresaDesigner')
const EmpresaDesigner = require('../models/EmpresaDesigner')
const Plano = require('../models/Plano')
const Registro = require('../models/Registro')
const Funcionario = require('../models/Funcionario')
const Cargo = require('../models/Cargo')
const Imagem = require('../models/Imagem')
const UtilRotas = require('../routes/utilRotas')

// Post - Criação de uma Nova Empresa
router.post('/PostEmpresa/', async (req, res) => {

    // req.body   
    const {
        idEmpresa,
        guid,
        razaoSocial,
        nomeFantasia,
        cnpj,
        endereco,
        contato,
        designer,
        plano,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome'];
    }

    if (!String(endereco.cep).trim()) {
        errors.cep = ['CEP'];
    }

    if (!String(endereco.logradouro).trim()) {
        errors.logradouro = ['Logradouro'];
    }

    if (!String(contato.email).trim()) {
        errors.email = ['Email'];
    }

    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        try {

            const empresa = {
                idEmpresa,
                guid,
                razaoSocial,
                nomeFantasia,
                cnpj,
                endereco,
                contato,
                designer,
                plano,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const empresaFind = await Empresa.findOne().sort({ _id: -1 }).limit(1)

            console.log('Retorno FindOne Empresa' + empresaFind);

            if (empresaFind == null) {

                // Criando a Empresa
                const empresaCreate = await Empresa.create(empresa)

                res.status(201).json({
                    success: true,
                    message: "Empresa criada com sucesso!",
                    data: empresaCreate,
                })

            } else {

                // Adiciona .+1 no Id Empresa 
                empresa.idEmpresa = (empresaFind.idEmpresa + 1)

                empresa.designer.idEmpresa = empresa.idEmpresa

                console.log(empresa.idEmpresa);

                // Criando a Empresa
                const empresaCreate = await Empresa.create(empresa)

                res.status(201).json({
                    success: true,
                    message: "Empresa criada com sucesso!",
                    data: empresaCreate,
                })

            }


        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar a Empresa.',
                error: error
            })
        }

    }

})

// Validação por Email
router.get('/ValidacaoEmpresaPorId/:Id', async (req, res) => {

    // extrair o dado da requisição, pela ulr = req.params
    const id = req.params.Id

    console.log(req.params.Id)

    try {

        const empresa = await Empresa.findOne({ id: Number.parseInt(id) })

        console.log(empresa)

        if (!empresa) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Ops, O Id ' + id + ' da empresa ' + empresa.nome + ' informado já foi registrado!',
                data: empresa,
            })
        }



    } catch (error) {
        res.status(500).json({ error: error })
    }

})

// Get Empresa
router.get('/GetEmpresaApp', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const empresaFindOne = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

        if (empresaFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFindOne,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa por Package
router.get('/GetEmpresaPackage', async (req, res) => {

    const package = req.query.Package

    try {

        const empresaFindOne = await Empresa.findOne({ package: String(package) })

        if (empresaFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            
            const empresaDesigner = await EmpresaDesigner.findOne({ idEmpresa: Number.parseInt(empresaFindOne.idEmpresa) })

            const imagem = await Imagem.findOne({ guid: empresaFindOne._id })

            empresaDesigner.imagem = imagem
            empresaFindOne.designer = empresaDesigner           

            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFindOne,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetEmpresaPorId', async (req, res) => {

    const empresaId = req.query.IdEmpresa

    try {

        const empresaFindOne = await Empresa.findOne({ idEmpresa: Number.parseInt(empresaId) })

        if (empresaFindOne == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {

            const empresaDesigner = await EmpresaDesigner.findOne({ idEmpresa: Number.parseInt(empresaFindOne.idEmpresa) })

            empresaFindOne.designer = empresaDesigner

            const imagem = await Imagem.findOne({ guid: empresaFindOne._id })

            empresaFindOne.imagem = imagem

            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFindOne,
            })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetEmpresas', async (req, res) => {


    try {

        const empresaFind = await Empresa.find()

        if (empresaFind == null) {
            res.status(201).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Empresa encontrada com sucesso!',
                data: empresaFind,
            })
        }

        console.log('Foram encontradas ', empresaFind.length + ' empresas!')

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Get Empresa
router.get('/GetPlanos', async (req, res) => {


    try {

        const planoFind = await Plano.find()

        if (planoFind.length == 0) {
            res.status(201).json({
                success: false,
                message: 'Os Planos não foram encontrados!',
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Planos encontrados com sucesso!',
                data: planoFind,
            })
        }

        console.log('Foram encontradas ', planoFind.length + ' planos!')

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Plano.',
            error: error
        })
    }

})

// Delete Empresa 
router.delete('/ExcluirEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.find({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            await Empresa.deleteMany({ idEmpresa: empresaId })

            res.status(200).json({
                success: true,
                message: 'Empresa excluida com sucesso!',
                data: empresaFind,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Desativar Empresa 
router.patch('/DesativarEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.findOne({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            const empresaUpdateOne = await Empresa.findOneAndUpdate({ idEmpresa: empresaFind._id }, empresaFind, { new: true })

            res.status(200).json({
                success: true,
                message: 'Empresa atualizada com sucesso!',
                data: empresaUpdateOne,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Desativar Empresa 
router.patch('/AtualizaEmpresa', async (req, res) => {


    const empresaId = req.query.IdEmpresa

    try {

        const empresaFind = await Empresa.findOne({ idEmpresa: empresaId })

        if (empresaFind == null) {
            res.status(422).json({
                success: false,
                message: 'O Empresa não foi encontrado!',
                data: {},
            })
        } else {

            const {
                idEmpresa,
                guid,  
                razaoSocial,
                nomeFantasia,              
                cnpj,     
                endereco,
                contato,
                designer,
                plano,
                package,
                ativo,
                dataCriacao,
                dataAtualizacao
            } = req.body

            const empresa = {
                idEmpresa,
                guid,   
                razaoSocial,
                nomeFantasia,           
                cnpj,                
                endereco,
                contato,
                designer,
                plano,
                package,
                ativo,
                dataCriacao,
                dataAtualizacao
            }

            const empresaUpdateOne = await Empresa.findOneAndUpdate({ idEmpresa: empresaId }, empresa, { new: true })

            res.status(200).json({
                success: true,
                message: 'Empresa atualizada com sucesso!',
                data: empresaUpdateOne,
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível buscar a Empresa.',
            error: error
        })
    }

})

// Post Plano 
router.post('/PostPlano', async (req, res) => {

    const {
        nome,
        codigo,
        quantidadeEstabelecimento,
        quantidadeProduto,
        quantidadeCategoria,
        quantidadeImagem,
        ativo,
        dataCriacao,
        dataAtualizacao,
    } = req.body

    const errors = {};

    if (!String(nome).trim()) {
        errors.nome = ['Nome'];
    }

    if (!String(codigo).trim()) {
        errors.codigo = ['Codigo'];
    }


    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        const plano = {
            nome,
            codigo,
            quantidadeEstabelecimento,
            quantidadeProduto,
            quantidadeCategoria,
            quantidadeImagem,
            ativo,
            dataCriacao,
            dataAtualizacao,
        }

        try {

            const planoCreate = await Plano.create(plano)

            if (planoCreate == null) {
                res.status(201).json({
                    success: false,
                    message: "Não foi possível cadastrar o Plano!",
                    data: {},
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Plano cadastrado com sucesso!",
                    data: planoCreate,
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível realizar a buscar do Plano.',
                error: error
            })
        }

    }

})

// Post - Criação de uma Nova Empresa / Plano
router.post('/PostRegistroEmpresa/', async (req, res) => {

    // req.body   
    const {
        guid,
        empresa,
        funcionario,
        ativo,
        dataCriacao,
        dataAtualizacao
    } = req.body

    const errors = {};

    console.log(empresa.cnpj)

    if (validaCpfCnpj(empresa.cnpj)) {
        errors.nome = ['Responsável'];
    }

    if (!String(empresa.responsavel).trim()) {
        errors.nome = ['Responsável'];
    }

    if (!String(empresa.endereco.cep).trim()) {
        errors.cep = ['CEP'];
    }

    if (!String(empresa.endereco.numero).trim()) {
        errors.numero = ['Número Logradouro'];
    }

    if (!String(empresa.contato.email).trim()) {
        errors.email = ['Email'];
    }

    if (!String(empresa.contato.telefone).trim()) {
        errors.telefone = ['Telefone'];
    }

    if (Object.keys(errors).length) {

        errors.itens = ['\nSão os ' + Object.keys(errors).length + ' itens obrigatórios!'];

        res.status(422).json({ error: errors })
    } else {

        try {


            const empresaFind = await Empresa.findOne().sort({ _id: -1 }).limit(1)

            console.log('Retorno FindOne Empresa' + empresaFind);

            if (empresaFind == null) {

                // Criando a Empresa
                const empresaCreate = await Empresa.create(empresa)

                res.status(201).json({
                    success: true,
                    message: "Primeira empresa criada com sucesso!",
                    data: empresaCreate,
                })

            } else {

                const empresaAlreadyRegistered = await Empresa.find({ "contato.email": empresa.contato.email })

                console.log('Empresa já cadastra = ' + empresaAlreadyRegistered.length);

                if (empresaAlreadyRegistered != 0) {

                    res.status(200).json({
                        success: false,
                        message: "Se você já teve cadastro anteriormente em nosso sistema pedimos que ao invés de criar uma nova conta você faça um login, utilizando dos mesmos dados" +
                            "\nAgora, se é sua primeira vez utilizando o nosso sistema tente um e-mail alternativo.!",
                        data: empresaAlreadyRegistered,
                    })

                } else {

                    // Adiciona .+1 no Id Empresa 
                    empresa.idEmpresa = (empresaFind.idEmpresa + 1)

                    empresa.designer.idEmpresa = empresa.idEmpresa

                    console.log(empresa.idEmpresa);

                    // Criando a Empresa
                    const empresaCreate = await Empresa.create(empresa)

                    const funcionarioCreate = await Funcionario.create(funcionario)

                    if (empresaCreate == null && funcionarioCreate == null) {
                        res.status(201).json({
                            success: false,
                            message: "Não foi possível realizar o registro, Tente novamente mais tarde!",
                            data: [empresaCreate, funcionarioCreate],
                        })
                    } else {

                        funcionarioCreate.empresa = empresaCreate

                        const cargo = {
                            nome: 'Administrador',
                            idEmpresa: empresaCreate.idEmpresa,
                            ativo: true,
                            dataCriacao: new Date().toISOString(),
                            dataAtualizacao: new Date().toISOString(),
                        }

                        const cargoCreate = await Cargo.create(cargo)

                        funcionarioCreate.cargo = cargoCreate

                        const funcionarioUpdate = await Funcionario.findOneAndUpdate({ _id: funcionarioCreate._id }, funcionarioCreate, { new: true })

                        const registro = {
                            guid: guid,
                            empresa: empresaCreate,
                            funcionario: funcionarioUpdate,
                            ativo: ativo,
                            dataCriacao: dataCriacao,
                            dataAtualizacao: dataAtualizacao
                        }

                        res.status(200).json({
                            success: true,
                            message: "Parabéns sua empresa foi criada com sucesso no Gapp Delivery, Aproveite todas os benefícios de ser Gapp Delivery!",
                            data: { registro }
                        })
                    }

                }
            }


        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Não foi possível buscar a Empresa.',
                error: error
            })
        }

    }

})

function validaCpfCnpj(val) {
    if (val.length == 14) {
      var cpf = val.trim();
  
      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace('-', '');
      cpf = cpf.split('');
  
      var v1 = 0;
      var v2 = 0;
      var aux = false;
  
      for (var i = 1; cpf.length > i; i++) {
        if (cpf[i - 1] != cpf[i]) {
          aux = true;
        }
      }
  
      if (aux == false) {
        return false;
      }
  
      for (var i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
        v1 += cpf[i] * p;
      }
  
      v1 = ((v1 * 10) % 11);
  
      if (v1 == 10) {
        v1 = 0;
      }
  
      if (v1 != cpf[9]) {
        return false;
      }
  
      for (var i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
        v2 += cpf[i] * p;
      }
  
      v2 = ((v2 * 10) % 11);
  
      if (v2 == 10) {
        v2 = 0;
      }
  
      if (v2 != cpf[10]) {
        return false;
      } else {
        return true;
      }
    } else if (val.length == 18) {
      var cnpj = val.trim();
  
      cnpj = cnpj.replace(/\./g, '');
      cnpj = cnpj.replace('-', '');
      cnpj = cnpj.replace('/', '');
      cnpj = cnpj.split('');
  
      var v1 = 0;
      var v2 = 0;
      var aux = false;
  
      for (var i = 1; cnpj.length > i; i++) {
        if (cnpj[i - 1] != cnpj[i]) {
          aux = true;
        }
      }
  
      if (aux == false) {
        return false;
      }
  
      for (var i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v1 += cnpj[i] * p1;
        } else {
          v1 += cnpj[i] * p2;
        }
      }
  
      v1 = (v1 % 11);
  
      if (v1 < 2) {
        v1 = 0;
      } else {
        v1 = (11 - v1);
      }
  
      if (v1 != cnpj[12]) {
        return false;
      }
  
      for (var i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v2 += cnpj[i] * p1;
        } else {
          v2 += cnpj[i] * p2;
        }
      }
  
      v2 = (v2 % 11);
  
      if (v2 < 2) {
        v2 = 0;
      } else {
        v2 = (11 - v2);
      }
  
      if (v2 != cnpj[13]) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }


module.exports = router