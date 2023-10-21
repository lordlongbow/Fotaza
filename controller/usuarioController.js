const { usuario } = require('../BD/bd');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

exports.usuarioPerfil = async (req, res) => {
  const user = req.session.usuario;
  try {
    const usuariologueado = await usuario.findByPk(user.id);
    res.render('usuario/miPerfil', { usuario: usuariologueado, usuariologueado: user });
  } catch (error) {
    res.render('error');
  }
}

exports.cabioFotoPerfil = async (req, res) => {
  const user = req.session.usuario
  const usuariologueado = await usuario.findByPk(user.id);
  const fotoPerfil = req.files.fotoPerfil;

  const nombreImagen = uuid.v1() + usuariologueado.username;
  const imagenRuta = `./public/images/${nombreImagen}.jpg`
  fotoPerfil.mv(imagenRuta);
  const foto = `/images/${nombreImagen}.jpg`;
  usuariologueado.fotoRuta = foto;
  await usuariologueado.save()
  res.render('usuario/miPerfil', { usuario: usuariologueado, usuariologueado: user });
}

exports.cambioContrasena = async (req, res) => {
  const usuarioLogueado = req.session.usuario;
  const id = req.params.id;
  const usuarioActual = await usuario.findByPk(id);

  if (!usuarioLogueado) {
    return res.render('error', { error: "Debes estar logueado" });
  }

  if (usuarioLogueado.id !== usuarioActual.id) {
    return res.render('error', { error: "No tienes permisos para cambiar la contraseña de este usuario" });
  }

  const { contrasenaActual, nuevaContrasena, nuevaContrasena2 } = req.body;

  try {
    const isMatch = await bcrypt.compare(contrasenaActual, usuarioActual.password);
    if (!isMatch) {
      return res.render('error', { error: "La contraseña actual es incorrecta" });
    }

    if (nuevaContrasena !== nuevaContrasena2) {
      return res.render('error', { error: "Las nuevas contraseñas no coinciden" });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    usuarioActual.password = hashedPassword;
    await usuarioActual.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error');
  }
};

exports.editarPerfil = async  (req, res) =>{ 
  const id = req.params.id
  const usuariologueado = req.session.usuario;
  const usuarioActual = await usuario.findByPk(id);
  const nuevoUsername = req.body.username
  if(usuariologueado.id === usuarioActual.id ){
    if(nuevoUsername != "" || nuevoUsername != " "){
      usuarioActual.username = nuevoUsername
    }

  }

  await usuarioActual.save()
res.redirect('/')
}