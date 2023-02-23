const router = require('express').Router()

const Empresa = require('../models/Empresa')
const Plano = require('../models/Plano')

// Update Plano Empresa 
router.patch('/UpdatePlanoEmpresa', async (req, res) => {

    try {

        const empresaId = req.query.IdEmpresa

        const  {
            idEmpresa,            
            plano,  
            ativo,
            dataCriacao,
            dataAtualizacao 
        } = req.body
    
        const empresa = {
            idEmpresa,           
            plano,  
            ativo,
            dataCriacao,
            dataAtualizacao 
        }
    
        try {
    
            const updatedEmpresa = await Empresa.updateOne({ idEmpresa: empresaId }, empresa)
    
            console.log(updatedEmpresa)
    
            if (updatedEmpresa.matchedCount === 0) {
                res.status(422).json({ message: 'A Empresa não foi encontrado!' })
                return
            }
    
            res.status(200).json({
                success: true,
                message: 'Plano atualizado com sucesso!',
                data: empresa,
            })
    
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Não foi possivel atualizar o plano',
                error: error
            })
        }

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Não foi possível a operação.',
            error: error
        })
    }

})

module.exports = router