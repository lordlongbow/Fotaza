
const { comentario, usuario } = require('../BD/bd');


module.exports.eliminarComentario = async (req, res) => {
    const id_comentario = req.params.id;
    const usuarioLogueado = req.session.usuario;
   // const id_usuario = req.session.usuario.id;
    const comentarioErroneo = await comentario.findByPk(id_comentario);
    if (comentarioErroneo.id_usuario === usuarioLogueado.id && comentarioErroneo.id_comentario == id_comentario) {
        try {
            await comentario.destroy({ where: { id_comentario } });
           res.send("todo bien")
        }  
        catch (error) {
            console.log("este es el error: " + error)
            throw error;
        }
    }
}

module.exports.getModificarComentario = async (req, res) => {

    const usuariologueado = req.session.usuario;
    const id_comentario = req.params.id;
    const comentarioErroneo = await comentario.findByPk(id_comentario);

    res.render('comentario/modificarComentario', { usuariologueado: usuariologueado, comentario: comentarioErroneo, id: id_comentario });

}


module.exports.modificarComentario = async (req, res) => {
    const usuarioLogueado = req.session.usuario;
    const id_comentario = req.params.id;
    const comentarioErroneo = await comentario.findByPk(id_comentario);
    if (comentarioErroneo.id_usuario === usuarioLogueado.id && comentarioErroneo.id_comentario == id_comentario) {
        const { texto } = req.body;
        comentarioErroneo.texto = texto;
        await comentarioErroneo.save();
        res.redirect(`/`);
    }
}

module.exports.traerComentarios = async (req, res) => {
    const comentariosRecuperados = await comentario.findAll();
}

module.exports.getAgregarComentario = async (req, res) => {
    var id_publicacion = req.params.id;
    var usuariologueado = req.session.usuario;
    res.render('comentario/agregarComentario', { usuariologueado: usuariologueado, id_publicacion: id_publicacion });
}

module.exports.agregarComentario = async (req, res) => {
    const id_publicacion = req.params.id_publicacion;
    const usuarioLogueado = req.session.usuario;
    const id_usuario = usuarioLogueado.id;
    const texto = req.body.comentario;
    const fechaDate = new Date();
    const dia = fechaDate.getDate();
    const mes = fechaDate.getMonth() + 1;
    const anio = fechaDate.getFullYear();
    const fecha = `${anio}-${mes}-${dia}`;
    try {
        const nuevoComentario = await comentario.create({ id_publicacion, id_usuario, texto, fecha });
        console.log("Comentario " + JSON.stringify(nuevoComentario))
        const usuarioEmisor = await usuario.findByPk(id_usuario);
        res.send({ nuevoComentario, usuarioEmisor })
    } catch (error) {
        throw error
    }
}  


module.exports.getComentarios = async (req, res) => {
    const id_publicacion = req.params.id_publicacion; 
    console.log("Id_publicacion: " + id_publicacion);
    
    try {
        const comentarios = await comentario.findAll({
            where: { id_publicacion: id_publicacion },
            include: [{ model: usuario, as: 'usuario', attributes: ['id', 'username', 'fotoRuta'] }]
        });
        res.send(comentarios);
    } catch (error) {
        console.log("El error es: " + error);
        throw error;
    }
}
