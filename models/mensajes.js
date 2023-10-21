module.exports = (sequelize, type) =>{
    return sequelize.define('mensajes', {
        id_mensajes: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_publicacion: {
            type: type.INTEGER
        },
        id_usuario: {
            type: type.INTEGER
        },
        texto: {
            type: type.STRING
        },
        fecha:{
            type: type.DATE
        },
        remitente:{
            type: type.INTEGER
        }
    },{
        timestamps : false
    });
}