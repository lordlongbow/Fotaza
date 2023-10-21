var express = require("express");
var router = express.Router();
var derechosController = require("../controller/derechoController");

router.get("/traerDerechos", derechosController.traerDerechos);

module.exports = router;