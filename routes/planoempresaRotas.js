const Plano = require('../models/Plano')

const router = require('express').Router()

// Post Plano Empresa 
router.post('/PostPlanoEmpresa', async (req, res) => {

    try {

        const planoEmpresaCreate = await Plano.create(cargo)

        if (planoEmpresaCreate == null) {

            res.status(201).json({
                success: false,
                message: "Permissão cadastrado com sucesso!",
                data: null,
            })

        } else {

            res.status(200).json({
                success: true,
                message: "Permissão cadastrado com sucesso!",
                data: planoEmpresaCreate,
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