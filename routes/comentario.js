var express = require('express');
var router = express.Router();
var comentarioController = require('../controller/comentarioController');

router.get('/agregarComentario/:id', comentarioController.getAgregarComentario);

router.get("/getComentarios/:id_publicacion", comentarioController.getComentarios);

router.post('/agregarComentario/:id_publicacion', comentarioController.agregarComentario);

router.get('/eliminarComentario/:id', comentarioController.eliminarComentario);
router.get('/modificarComentario/:id', comentarioController.getModificarComentario);
router.post('/modificarComentario/:id', comentarioController.modificarComentario);

module.exports = router;