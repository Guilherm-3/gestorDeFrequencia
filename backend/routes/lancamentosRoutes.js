// backend/routes/lancamentosRoutes.js

const express = require('express');
const router = express.Router();

// Importamos o nosso controller
const controller = require('../controllers/lancamentosController');

// Definimos as rotas e qual função do controller cada uma vai chamar

router.get('/teste/', controller.teste);

// FREQUENCIA

// Rota para LER (GET) 
router.get('/frequencias/', controller.listarFrequenciasDia);

// Rota para CRIAR (POST) 
router.post('/frequencias/', controller.criarFrequencia);

// Rota para APAGAR (DELETE) 
router.delete('/frequencias/:idFrequencia/', controller.deletarFrequencia);


// PESSOA

// Rota para LER (GET) 
router.get('/pessoa/:data/', controller.listarPessoas);

// Rota para CRIAR (POST) 
router.post('/pessoa/', controller.criarPessoa);

// Rota para ATUALIZAR (PUT)
router.put('/pessoa/', controller.atualizarPessoa);

// Rota para APAGAR (DELETE) 
router.delete('/pessoa/', controller.deletarPessoa);

module.exports = router;