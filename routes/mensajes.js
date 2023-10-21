var express = require('express');
var router = express.Router();
var mensajesController = require('../controller/mensajesController');

router.post('/agregarMensajes/:id_publicacion', mensajesController.agregarMensajes);


router.post('/responderMensajes/:id_mensajes', mensajesController.responderMensajes);


module.exports = router;