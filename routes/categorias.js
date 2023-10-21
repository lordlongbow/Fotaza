var express = require("express");
var router = express.Router();
var categoriaController = require("../controller/categoriaController");

router.get("/getCategorias", categoriaController.traerCategorias);

module.exports = router;