var express = require('express');
var router = express.Router();
var usuarioController = require('../controller/usuarioController');
/* GET users listing. */
router.get('/miPerfil', usuarioController.usuarioPerfil);

router.get('/miPerfil/:id', usuarioController.usuarioPerfil);

router.post('/miPerfil/cambiarFotoPerfil', usuarioController.cabioFotoPerfil);

router.post('/cambiarFotoPerfil', usuarioController.cabioFotoPerfil);

router.post('/miPerfil/cambiarContrasena/:id', usuarioController.cambioContrasena);

router.post('/miPerfil/editarPerfil/:id', usuarioController.editarPerfil);  

module.exports = router;
