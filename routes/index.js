var express = require('express');
var router = express.Router();
var indexController = require('../controller/indexController');

//router.get('/', indexController.getListaImagenes);

router.get('/', indexController.getListaImagenes);


router.get('/about', function(req, res, next) {
  
});

router.get('/contact', function(req, res, next) {
  
});

router.get('/buscar/:buscador', indexController.buscar);

module.exports = router;
