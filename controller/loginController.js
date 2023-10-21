const {usuario} = require('../BD/bd');
const bcrypt = require('bcrypt');


exports.guardarUsuario = (req, res) => {
  const datos = req.body;
  usuario.findOne({ where: { email: datos.email } })
    .then(results => {
      if (results) {
        res.render('login/registro', { error: 'Usuario ya Creado!!' });
      } else {
        bcrypt.hash(datos.password, 10)
          .then(hash => {
            datos.password = hash;
            usuario.create({
              username: datos.username,
              password: datos.password,
              email: datos.email
            })
            .then(() => {
              res.render('login/login', { exito: 'Bienvenido, ya estas dentro!!. Ahora puedes iniciar sesión.' });
            })
            .catch(error => {
              throw error;
            });
          });
      }
    })
    .catch(error => {
      throw error;
    });
};


exports.autenticarUsuario = (req, res) => {
  const datos = req.body;
  const password = req.body.password;
  usuario.findOne({where : {email : datos.email}})
    .then(async results => {
      if (results != null) {
        const isMatch = await bcrypt.compare(password, results.password);
        if (!isMatch) {
          res.render('login/login', { error: 'Datos Incorrectos!!' });
        } else {
          req.session.loggedin = true;
          req.session.name = results.username;
          req.session.usuario = results;
          res.redirect('../');
        }
      } else {
        res.render('login/registro', { error: 'Debes registrarte!!' });
      }
    })
    .catch(error => {
      throw error;
    });
};

exports.logout = (req, res) => {
  if (req.session.loggedin === true) {
    req.session.destroy();
    res.redirect('/');
  }
};
