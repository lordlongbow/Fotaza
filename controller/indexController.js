const { publicacion, mensajes, derechos, categoria, comentario, usuario, valoraciones, sequelize } = require('../BD/bd');
const valoracionesController = require('../controller/valoracionesController');
const mensajesController = require('../controller/mensajesController');

const publicacionController = require('../controller/publcicaionController');
const { Op } = require('sequelize');

/*
exports.getListaImagenes = async (req, res) => {
  var usuariologueado = req.session.usuario;
  var mensajesRecibidos;
  try {

    var publicacionesobtenidas = await traerTodo();

    for (const publicacion of publicacionesobtenidas) {
      publicacion.promedio = await valoracionesController.promedioValorados(publicacion.id_publicacion);
    }

    if (usuariologueado != null) {
      mensajesRecibidos = await mensajesController.traerMensajes(req, res);
    }
    else {
      mensajesRecibidos = [];
      
      }
  

    const mensaje = "No hay nada"
    if (publicacionesobtenidas.length < 0) {
      res.render('index', { mensaje: mensaje, usuariologueado: usuariologueado });
    }

    res.render('index', { mensajesRecibidos: mensajesRecibidos, publicaciones: publicacionesobtenidas, usuariologueado: usuariologueado });
  } catch (error) {
    throw error;
  }
};
 */

exports.getListaImagenes = async (req, res) => {
  var usuariologueado = req.session.usuario;
  var mensajesRecibidos;
var IPP = 10;
var numeroDePagina = 1;
  try {

    var publicacionesobtenidas = await publicacionController.mostrarFotosPaginadas();
/*
for (const publicacion of publicacionesobtenidas) {
  publicacion.promedio = await valoracionesController.promedioValorados(publicacion.id_publicacion);
}
*/

    if (usuariologueado != null) {
      mensajesRecibidos = await mensajesController.traerMensajes(req, res);
    }
    else {
      mensajesRecibidos = [];
      
      }
  

    const mensaje = "No hay nada"
    if (publicacionesobtenidas.length < 0) {
      res.render('index', { mensaje: mensaje, usuariologueado: usuariologueado });
    }

    res.render('index', { mensajesRecibidos: mensajesRecibidos, publicaciones: publicacionesobtenidas, usuariologueado: usuariologueado });
  } catch (error) {
    throw error;
  }
}


exports.buscar = async (req, res) => {
  const palabra = req.params.buscador;
 console.log("En el buscar del controlador" + palabra)
  if (palabra == null || palabra == "" || palabra == undefined) {
    res.send("No ha escrito una palabra para buscar");
  } else {
    const usuario = req.session.usuario;
    let comentarios = [];
    try {
      const listaPublicaciones = await publicacion.findAll({
        where: {
          [Op.or]: [
            {
              titulo: {
                [Op.like]: `%${palabra}%`
              }
            }
          ]
        }
      });

      if (listaPublicaciones.length != 0) {
        for (const publicacion of listaPublicaciones) {
          publicacion.usuario = await publicacion.getUsuario();
          publicacion.categoria = await publicacion.getCategoria();
          publicacion.derechos = await publicacion.getDerechos();
          publicacion.comentario = await publicacion.getComentario();
          publicacion.valoraciones = await publicacion.getValoraciones();
          publicacion.promedio = await valoracionesController.promedioValorados(publicacion.id_publicacion);
        }
        console.log("previo al send del if");
        res.send({ publicaciones: listaPublicaciones});
      } else {
        console.log("No se encontraron publicaciones");
        res.send("No se encontraron publicaciones");
      }
    } catch (error) {
      console.log("El error es: " + error);
    }
  }
};



async function traerTodo() {
  try {
    var publicacionesobtenidas = await publicacion.findAll({
      include: [{
        model: usuario,

        attributes: ['id', 'username', 'email', 'intereses', 'fotoRuta']
      },
      {
        model: categoria,
        as: 'categoria',
        attributes: ['id_categoria', 'descripcion']
      },
      {
        model: derechos,
        as: 'derechos',
        attributes: ['id_derechos', 'descripcion']
      },
      {
        model: comentario,
        as: 'comentario',
        attributes: ['id_comentario', 'id_usuario', 'id_publicacion', 'texto', 'fecha'],
        include: [
          {
            model: usuario,
            as: 'usuario',
            attributes: ['id', 'username', 'fotoRuta']
          }
        ]
      },
      {
        model: valoraciones,
        as: 'valoraciones',
        attributes: ['id_valoracion', 'id_usuario', 'id_publicacion', 'valor'],
      }

      ]
    })
    return publicacionesobtenidas;
    ;
  }
  catch (error) { console.log("El error es:  " + error) }
}


