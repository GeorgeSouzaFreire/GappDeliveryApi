const request = require('request')
const router = require('express').Router()

router.get('/getCEP', function (req, res, next) {

  const cep = req.query.CEP

  try {
    console.log(cep);
    request.get({
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      uri: 'https://www.google.com/',
      function(error, response, body) {
        console.log(body);

        if (!error && response.statusCode === 200) {
          console.log(body);
          res.status(200).json({
            success: true,
            message: 'Endereço encontrado com sucesso!',
            data: body,
          })
        } else {
          res.status(201).json({
            success: false,
            message: 'CEP não está de acordo ou não localizado em nossa base de dados.',
            error: error
          })
        }
      }

    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Não foi possível buscar a Empresa.',
      error: error
    })
  }

});

module.exports = router;