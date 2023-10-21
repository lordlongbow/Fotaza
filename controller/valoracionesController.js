const {valoraciones, sequelize} = require('../BD/bd');
/*
const crearValoraciones = async (req, res) => {
    const usuariologueado = req.session.usuario;
    const id_usuario = usuariologueado.id;
    const id_publicacion = req.params.id_publicacion;
    const valor = req.body.value;

    try{
        await valoraciones.create({id_publicacion, id_usuario, valor});
    }
    catch(error){
        console.log("El Error es: " + error)
        throw error;
    }
}*/
const updateAValorar = async (valor, valoracion )=>{ 
    const id = valoracion.id_valoracion;
    
    try{
        await valoraciones.update({valor}, {where: { id_valoracion: id}});
          
    }catch(error){
        console.log("Este es el error: "+ error);
        throw error
    }
}
module.exports.promedioValorados = async (id) => {
    var id_publicacion = id
    console.log("ID PARAMETTRO: " + id_publicacion)
    try {
        const resultado = await sequelize.query(`SELECT PROMEDIO_VALORACIONES(${id_publicacion}) AS PROMEDIO`, { type: sequelize.QueryTypes.SELECT });
        const promedio = resultado[0].PROMEDIO;
        if (promedio > 0) {
            return promedio;
        } else {
            return "Sé el primero en valorar ésta Publicación";
        }
    } catch (error) {
        throw error;
    }
};

promedioValoradosPublicado = async (id) => {
    var id_publicacion = id
    console.log("ID PARAMETTRO: " + id_publicacion)
    try {
        const resultado = await sequelize.query(`SELECT PROMEDIO_VALORACIONES(${id_publicacion}) AS PROMEDIO`, { type: sequelize.QueryTypes.SELECT });
        const promedio = resultado[0].PROMEDIO;
        if (promedio > 0) {
            return promedio;
        } else {
            return "Sé el primero en valorar ésta Publicación";
        }
    } catch (error) {
        throw error;
    }
};




module.exports.valorar = async (req, res) => {
    const usuariologueado = req.session.usuario;
    const id_usuario = usuariologueado.id;
    const id_publicacion = req.params.id_publicacion;
    const valor = req.body.valor;
    console.log("ENTRO")
    const valoracion = await valoraciones.findOne({ where: {
        id_publicacion: id_publicacion,
        id_usuario: id_usuario,
      } });

      var valoracionHecha;
    
    if(valoracion != null){
        updateAValorar(valor, valoracion);
        valoracionHecha =  promedioValoradosPublicado(id_publicacion);
        res.send(valoracionHecha)
    
    }else{
        await crearValoraciones(id_usuario, id_publicacion, valor);
        valoracionHecha = promedioValoradosPublicado(id_publicacion);
        res.send(valoracionHecha)
    
    }
  
}


async function crearValoraciones(id_usuario, id_publicacion, valor){

    try{
        await valoraciones.create({id_publicacion, id_usuario, valor});
    }
    catch(error){
        console.log("El Error es: " + error)
        throw error;
    }
}