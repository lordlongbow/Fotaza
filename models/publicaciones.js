module.exports = (sequelize, type) =>{
    return sequelize.define('publicaciones', {
        id_publicacion: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: type.INTEGER
        },
        titulo: {
            type: type.STRING
        },
        id_categoria: {
            type: type.INTEGER
        },
        formato: {
            type: type.STRING
        },
        id_derechos: {
          type: type.INTEGER  
        },
        resolucion: {
          type : type.STRING  
        },
        fecha_creacion: {
            type: type.DATE
        },
        estado : {
            type: type.BOOLEAN
        },
        imagen: {
            type: type.STRING
        },
        miniatura: {
            type: type.STRING
        }
    },{
        timestamps : false
    })

}
