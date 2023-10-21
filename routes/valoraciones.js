const express = require('express');
var router = express.Router();
var valoracionesController = require('../controller/valoracionesController');

router.post('/valorar/:id_publicacion', valoracionesController.valorar);

module.exports = router;