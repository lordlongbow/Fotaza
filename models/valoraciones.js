module.exports = (sequelize, type) => {
    return sequelize.define('valoraciones' , {
        id_valoracion: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_publicacion: {
          type: type.INTEGER

        },
        id_usuario:{
            type: type.INTEGER
        },
        valor: {
            type: type.INTEGER,
            validate: {
                max: 5,
                min: 1
            }
        }
    },{
        timestamps: false
    })
}