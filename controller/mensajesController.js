const db = require('../BD/bd');
const usuario = db.usuario;
const publicacion = db.publicacion;
const mensajes = db.mensajes;

module.exports.eliminarMensajes = async (req, res) =>{
const id_mensaje = req.params.id;
const usuarioLogueado = req.session.usuario;
const id_usuario = req.session.usuario.id;
const mensajesErroneo = await mensajes.findByPk(id_mensajes);
if(mensajesErroneo.id_usuario === usuarioLogueado.id && mensajesErroneo.id_mensajes == id_mensajes){
try{
    await mensajes.destroy({where: {id_mensajes}});
    res.redirect(`/`);
}
catch(error){
    console.log("este es el error: " + error)
    throw error;
}
}
}

module.exports.traerMensajes = async (req, res) =>{
    const usuarioLogueado = req.session.usuario;


    const mensajesRecuperados = await mensajes.findAll({
        where:{remitente: usuarioLogueado.id
        }, 
        include:[
            {
                model:usuario, 
                as:'receptor'                
            },
            {
                model:usuario, 
                as:'emisor'                
            }

        ]
    });

    return mensajesRecuperados;

}

module.exports.agregarMensajes = async (req,res) =>{ 
    const id_publicacion = req.params.id_publicacion;
    const usuarioLogueado = req.session.usuario;
    const id_usuario = usuarioLogueado.id;
    const texto = req.body.texto;
    const fecha = Date.now();
    var remitente;
    try{
        var publicacionEncontrada = await publicacion.findByPk(id_publicacion,{include:[{model:usuario}]});
        if(publicacionEncontrada != null && publicacionEncontrada.id_usuario != usuarioLogueado.id){
             remitente = publicacionEncontrada.id_usuario;    
        }
        const nuevoComentario = await mensajes.create({  id_publicacion, id_usuario, texto, fecha, remitente});
        
        res.redirect('/');
    }catch(error){
        throw error
    }
}

module.exports.responderMensajes = async (req,res) =>{
    const id_mensaje = req.params.id_mensajes
    const usuarioLogueado = req.session.usuario;
    const id_usuario = usuarioLogueado.id;
    const texto = req.body.texto;
    
    const fecha = Date.now();

    try{

        var mensaje = await mensajes.findByPk(id_mensaje)
        var id_publicacion = mensaje.id_publicacion;
        var remitente = mensaje.id_usuario;
        const nuevoComentario = await mensajes.create({  id_publicacion, id_usuario, texto, fecha, remitente});
        
        res.redirect('/');
    }catch(error){
        throw error
    }
    
}