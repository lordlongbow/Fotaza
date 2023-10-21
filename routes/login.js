var express = require('express');
var router = express.Router();
const loginController = require('../controller/loginController');

router.get('/', (req, res) => {
    if (req.session.loggedin != true) {
        res.render('login/login');
    } else {
        res.redirect('/');
    }
})

router.post('/', loginController.autenticarUsuario);


router.get('/registro', function(req, res, next) {
    if (req.session.loggedin != true) {
        res.render('login/registro');
    } else {
        res.redirect('/');
    }
});

router.post('/resgitro', loginController.guardarUsuario);

router.get('/logout', loginController.logout);


module.exports = router;