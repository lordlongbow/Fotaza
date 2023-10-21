var express = require('express');
var router = express.Router();
var publicacionCotroller = require('../controller/publcicaionController');
var derechosController = require('../controller/derechoController');
var categoriaController = require('../controller/categoriaController');
var chatController = require('../controller/chatController');

router.get('/agregarPublicacion', async (req, res)=>{
    var usuario = req.session.usuario;
    var dc = await derechosController.traerDerechos();
    var cc = await categoriaController.traerCategorias();
    res.render('publicacion/agregarPublicacion', {usuariologueado: usuario, derechos: dc, categorias: cc});
}); 

router.post('/agregar', publicacionCotroller.agregarPublicacion); 

router.get("/detallePublicaion/:id", publicacionCotroller.detallesPublicacion);

router.get("/modalPublicacion/:id", publicacionCotroller.traerPublicaciones);

router.get("/modalPublicacionlogueado/:id", publicacionCotroller.traerPublicacionesLogueado);

router.get("/actualizarVistaPrincipal/:id", publicacionCotroller.actualizarVistaPrincipal);

router.get("/mostrarFotosPaginadas/:IPP/:numeroDePagina" , publicacionCotroller.mostrarFotosPaginadas);

router.get("/editarPublicacion/:id", publicacionCotroller.getEditarPublicacion);

router.post("/editar/:id", publicacionCotroller.editarPublicacion);

router.get("/chat", chatController.chat);

router.post('/chat', chatController.chatPost);

router.get('/mensajeria/:id_publicacion', chatController.mensajeria);

router.get('/mensajeriaRespuesta/:mensaje', chatController.mensajeriaRespuesta);

router.delete('/borrarPublicacion/:id', publicacionCotroller.borrarPublicacion);

module.exports = router;