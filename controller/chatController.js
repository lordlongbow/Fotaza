const db = require('../BD/bd');
const mensajes = db.mensajes
const usuario = db.usuario;
const publicacion = db.publicacion;

// Resto del código...

module.exports.chat = async (req, res) => {
    const usuario = req.session.usuario;
    res.render('chat', { usuariologueado: usuario });
}

exports.mensajeria = async (req, res) => {
    var usuariologueado = req.session.usuario;
    var id_publicacion = req.params.id_publicacion;

    try {

        if (NaN == id_publicacion) {

            var publicacionesobtenidas = await publicacion.findByPk(id_publicacion, {
                include: [{
                    model: usuario,
                    attributes: ['id', 'username', 'email', 'intereses', 'fotoRuta']
                }
                ]
            });



        }
        else {
   
            var id_publicacion = req.params.id_publicacion
            var publicacionesobtenidas = await publicacion.findByPk(id_publicacion, {
                include: [{
                    model: usuario,
                    attributes: ['id', 'username', 'email', 'intereses', 'fotoRuta']
                }
                ]
            });

        }
        res.render('mensajeria', { publicaciones: publicacionesobtenidas, usuariologueado: usuariologueado });
    } catch (error) {
        throw error;
    }
};

exports.mensajeriaRespuesta = async (req, res) => {
    var usuariologueado = req.session.usuario;
    var id_mensaje = req.params.mensaje;


            
    try {

        var mensaje = await mensajes.findByPk(id_mensaje);

        var id_publicacion = mensaje.id_publicacion;
            var publicacionesobtenidas = await publicacion.findByPk(id_publicacion, {
                include: [{
                    model: usuario,
                    attributes: ['id', 'username', 'email', 'intereses', 'fotoRuta']
                }
                ]
            });
        res.render('mensajeria', { publicaciones: publicacionesobtenidas, usuariologueado: usuariologueado, mensaje : mensaje });
    } catch (error) {
        throw error;
    }
};





module.exports.chatPost = async (req, res) => {
    const usuario = req.session.usuario;

    res.render('chat', { usuariologueado: usuario });
}