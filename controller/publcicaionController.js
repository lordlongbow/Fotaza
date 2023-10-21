const { publicacion, usuario, categoria, derechos, comentario, valoraciones, mensajes } = require('../BD/bd');
var uuid = require('uuid');
const path = require('path');
const jimp = require('jimp')
const indexController = require('../controller/indexController');
const valoracionesController = require('../controller/valoracionesController')
const publicaciones = require('../models/publicaciones');

exports.traerPublicaciones = async () => {
  try {
    const publicaciones = await publicacion.findAll();
    return publicaciones;
  } catch (error) {
    throw error;
  }
};

exports.detallesPublicacion = async (req, res) => {
  const id = req.params.id;
  var usuariologueado = req.session.usuario;
  try {
    const publicacionObtenida = await publicacion.findByPk(id, {
      include: [{
        model: usuario,
        as: 'usuario',
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
      }
      ]
    });
    //   res.render('publicacion/detallePublicacion', { publicacionObtenida: publicacionObtenida, usuariologueado: usuariologueado });
  } catch (error) {
    throw error;
  }
}

exports.getEditarPublicacion = async (req, res) => {
  const id = req.params.id;
  var usuariologueado = req.session.usuario;
  try {
    const categorias = await categoria.findAll();
    const derechosObtenidos = await derechos.findAll();
    const publicacionObtenida = await publicacion.findByPk(id, {
      include: [{
        model: usuario,
        as: 'usuario',
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
      }
      ]
    })
    res.render('publicacion/editarPublicacion', { publicacionObtenida: publicacionObtenida, categorias: categorias, derechos: derechosObtenidos, usuariologueado: usuariologueado });
  } catch (error) {
    throw error;
  }
}

exports.editarPublicacion = async (req, res) => {
  var id_publicacion = req.params.id;
  const publicacionActual = await publicacion.findByPk(id_publicacion, {
    include: [
      {
        model: usuario,
        as: 'usuario',
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
      }

    ]
  })

  publicacionActual.titulo = req.body.titulo;
  const usuariologueado = req.session.usuario;
  publicacionActual.fecha_creacion = publicacionActual.fecha_creacion;
  publicacionActual.id_categoria = req.body.categoria;
  publicacionActual.id_derechos = req.body.derechos;
  try {
    publicacionActual.estado = req.body.estado;
    const foto = req.files?.foto;
    if (foto != null) {
      publicacionActual.formato = foto.mimetype;
      publicacionActual.resolucion = foto.size;
      const nombreImagen = uuid.v1();
      const imagenRuta = `./public/images/${nombreImagen}.jpg`
      foto.mv(imagenRuta);
      publicacionActual.imagen = `/images/${nombreImagen}.jpg`;
    }
    await publicacionActual.save();
    res.redirect('/');

  } catch (error) {
    res.render('error');
  }

}

exports.traerMejores = async (req, res) => {
  const usuariologueado = req.session.usuario

  try {
    const mejoresPublicaciones = await sequelize.query(`SELECT MEJORES_FOTOS(${id_publicacion}) AS PROMEDIO`, { type: sequelize.QueryTypes.SELECT });
    const promedio = resultado[0].PROMEDIO;
    if (promedio > 0) {

      return promedio;
    } else {
      return "Se el primero en valorar a esta Publicacion";
    }
  } catch (error) {
    throw error
  }
}

exports.mostrarPublicacion = async (id) => {
  try {
    const publicacion = await publicacion.findByPk(id, {
      include: [{
        model: usuario,
        as: 'usuario',
        attributes: ['id', 'username', 'fotoRuta']
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
      }]
    });
    return publicacion;
  } catch (error) {
    console.log("El error es: " + error)
  }
}

async function hacerMiniatura(imagenruta) {
  try {
    const imagen = await jimp.read(imagenruta);
    const miniatura = await imagen.resize(jimp.AUTO, 150);

    const nombreImagen = imagenruta.split('/').pop();
    var miniaturaRuta = `./public/miniaturas/${nombreImagen}_miniatura.jpg`;

    await miniatura.writeAsync(miniaturaRuta);
    miniaturaRuta = `/miniaturas/${nombreImagen}_miniatura.jpg`;
    return miniaturaRuta
  } catch (error) {
    console.error('Error al generar la miniatura:', error);
  }
}

// Llamada a la función
async function AgregarMarcaDeAgua(imagen) {
  const marcaAguaRuta = './public/images/fotaza-Watermark.jpg';
  try {
    const imagenOriginal = await jimp.read(imagen);
    const marcaAgua = await jimp.read(marcaAguaRuta);
    console.log("Agregar marca de agua")
    // Calcular la posición para centrar la marca de agua
    const x = (imagenOriginal.getWidth() - marcaAgua.getWidth());
    const y = (imagenOriginal.getHeight() - marcaAgua.getHeight());

    // Superponer la marca de agua en la imagen original
    imagenOriginal.composite(marcaAgua, x, y);

    const nuevoNombre = imagen.split('/').pop();
    // Guardar la imagen resultante con la marca de agua
    const imagenConMarcaRuta = `${nuevoNombre}`;
    await imagenOriginal.writeAsync(imagenConMarcaRuta);

    return imagenConMarcaRuta

  } catch (error) {
    console.error('Error al agregar la marca de agua:', error);
  }
}

exports.agregarPublicacion = async (req, res) => {
  console.log("LLEGUEEEEEEEEEEEEEEEEEE");
  const { titulo } = req.body;
  const usuariologueado = req.session.usuario;
  const id_usuario = usuariologueado.id;
  const id_categoria = req.body.categoria;
  console.log("req.body" + JSON.stringify(req.body));
  try {
    if (!req.files || !req.files.foto) {
      return res.status(400).send('No se ha seleccionado ninguna foto.');
    }
    let estado = req.body.estado;

    const id_derechos = req.body.derechos;
    if (id_derechos == 4) {
      estado = 1;
    }

    const foto = req.files.foto;

    const publicacionCreada = await agregarPublicacionParcial(
      foto,
      usuariologueado,
      titulo,
      id_categoria,
      id_derechos,
      estado
    );


    var publicacionActual = await publicacion.findByPk(publicacionCreada.id_publicacion)

    console.log("publicacion actual" + publicacionActual);

    const imagenRuta = path.join('./public', publicacionActual.imagen);
    const imagenMarcada = await AgregarMarcaDeAgua(imagenRuta);
    var miniaturaRuta = await hacerMiniatura(imagenMarcada);

    console.log("Paso un proceso " + miniaturaRuta);

    await publicacionActual.update({

      id_usuario,
      titulo,
      id_categoria,
      formato: publicacionCreada.formato,
      id_derechos,
      resolucion: publicacionCreada.resolucion,
      fecha_creacion: publicacionCreada.fecha_creacion,
      estado,
      imagen: publicacionCreada.imagen,
      miniatura: miniaturaRuta
    });
    console.log("Aca dos")
  } catch (error) {
    res.render('error');
  }
};
async function agregarPublicacionParcial(foto, usuariologueado, titulo, id_categoria, id_derechos, estado) {
  var id_usuario = usuariologueado.id;

  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1;
  var anio = fecha.getFullYear();
  var fecha_creacion = `${dia}-${mes}-${anio}`;

  try {
    const formato = foto.mimetype;
    const resolucion = foto.size;
    const nombreImagen = uuid.v1();
    const imagenRuta = `./public/images/${nombreImagen}.jpg`
    foto.mv(imagenRuta);
    const imagen = `/images/${nombreImagen}.jpg`;
    var miniatura = "";

    var nuevaPublicacion = await publicacion.create({
      id_usuario,
      titulo,
      id_categoria,
      formato,
      id_derechos,
      resolucion,
      fecha_creacion,
      estado,
      imagen,
      miniatura,
    });


    return nuevaPublicacion;
  } catch (error) {
    console.log("El error en la funcion agregarPublicacionParcial es: " + error);
  }
}

exports.traerPublicaciones = async (req, res) => {
  const id = req.params.id
  var publicacionObtenida = await publicacion.findByPk(id)

  res.send(publicacionObtenida);

}


exports.traerPublicacionesLogueado = async (req, res) => {
  const id = req.params.id
  var publicacionObtenida = await publicacion.findByPk(id, {
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

  var promedio = await valoracionesController.promedioValorados(publicacionObtenida.id_publicacion);
  publicacionObtenida.dataValues.promedio = promedio;

  res.send(publicacionObtenida);

}

exports.actualizarVistaPrincipal = async (req, res) => {
  try {
    console.log("saliendo imagenes 1");
    var publicacionObtenida = await publicacion.findAll({
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
    console.log("saliendo imagenes 2");

    for (const publicacion of publicacionObtenida) {
      const promedio = await valoracionesController.promedioValorados(
        publicacion.id_publicacion
      );
      publicacion.dataValues.promedio = promedio;
    }
    console.log("saliendo imagenes a");
    res.send(publicacionObtenida);


  } catch (error) {
    console.log("Error detectado " + error);
    throw error
  }


}


exports.borrarPublicacion = async (req, res) => {
  try {
    const id = req.params.id;
    const publicacionBorrada = await publicacion.destroy({
      where: {
        id_publicacion: id
      }
    })
    console.log("Borra")

  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.mostrarFotosPaginadas = async (req, res) => {
  let IPP;
  let numeroDePagina;

  
  if (req && req.params && req.params.IPP) {
    IPP = req.params.IPP;
  }else {  
    IPP = 10; // Valor predeterminado si no se proporciona en la solicitud
  }


  if (req && req.params && req.params.numeroDePagina) {
    numeroDePagina = req.params.numeroDePagina;
  } else {
    numeroDePagina = 1; // Valor predeterminado si no se proporciona en la solicitud
  }

  console.log("mostrarFotosPaginadas en el backend con los datos IPP y nume" + IPP + " " + numeroDePagina)
  try{
    var publicacionesobtenidas = await traerTodoPaginado(Number(IPP), numeroDePagina);
    console.log("Publicaciones " + publicacionesobtenidas);
    if(res){

      res.send(publicacionesobtenidas);  
    }else{

      return publicacionesobtenidas;
    }
  }catch(error){
    console.log("error en el back" + error);
    throw error  
  }
}

async function traerTodoPaginado(IPP, numeroDePagina) {
  console.log("traerTodoPaginado en el backend el IPP es " + IPP)
  try {
    console.log("Antes de la consulta en el try ")
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

      ],
      offset: (numeroDePagina - 1) * IPP,
      limit: (IPP < 10 )? 10 : IPP  
   
    })
     console.log("Publicaciones en el try " + publicacionesobtenidas.toString());
    for (const publicacion of publicacionesobtenidas) {
      const promedio = await valoracionesController.promedioValorados(
        publicacion.id_publicacion
      );
      publicacion.dataValues.promedio = promedio;
   
    }
   
    return publicacionesobtenidas;
    
  }
  catch (error) {  console.log("El error es:  " + error) }
}

async function traeMejores(){
  
}
