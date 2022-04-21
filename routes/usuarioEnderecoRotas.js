const router = require('express').Router()

const { response } = require('express')
const UsuarioEndereco = require('../models/UsuarioEndereco')



// Create 
router.post('/', async (req, res) => {

    // req.body
    // {name: "", salary: "", "approved"}
    const{name, salary, approved}  = req.body

    if(!name){
        res.status(422).json({error: 'Obrigatorio o Nome'})
    }

    const person = {
        name,
        salary, 
        approved
    }

    // create

    try{

        // Criando dados
        await UsuarioEndereco.create(person)

        res.status(201).json({message: "Pessoa inserida com sucesso"})

    }catch(error){
        res.status(500).json({error: error})
    }

})


// Read - Leitura de dados
router.get('/', async (req, res) => {

    try {

        const people = await UsuarioEndereco.find()
        
        res.status(200).json(people)

    } catch (error) {
        res.status(500).json({error : error})
    }


})

router.get('/:id', async (req, res) =>{

    console.log(req)

    // extrair o dado da requisição, pela ulr = req.params

    const id = req.params.id

    try {

        const person = await UsuarioEndereco.findOne({ _id: id})

        if(!person){
            res.status(422).json({message : 'O usuário não foi encontrado!'})
        }

        res.status(200).json(person)
        
    } catch (error) {
        res.status(500).json({error : error})
    }


})


// Update - Atualização de dados (PUT, PATCH)

router.patch('/:id', async (req, res) =>{

    const id = req.params.id

    const { name, salary , approved} = req.body

    const person = {
        name,
        salary,
        approved,
    }

    try {
        
        const updatedUsuarioEndereco = await UsuarioEndereco.updateOne({_id: id}, person)

        console.log(updatedUsuarioEndereco)

        if(updatedUsuarioEndereco.matchedCount ===0){
            res.status(422).json({message : 'O usuário não foi encontrado!'})
            return
        }

        res.status(200).json(person)

    } catch (error) {
        res.status(500).json({error : error})
    }

})

// Delete

router.delete('/:id', async (req, res) => {


    const id = req.params.id

    const person = await UsuarioEndereco.findOne({ _id: id})

    if(!person){
        res.status(422).json({message : 'O usuário não foi encontrado!'})
        return
    }

    try {

        await UsuarioEndereco.deleteOne({_id: id})

        res.status(200).json({message : 'Usuário removido com sucesso!'})
        
    } catch (error) {
        res.status(500).json({error : error})
    }

})


module.exports = router