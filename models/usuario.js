//const {publicacion} = require('../BD/bd');

module.exports = (sequelize, type) =>{
    return sequelize.define('usuario', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: type.STRING
        },
        email: {
            type: type.STRING
        },
        password: {
            type: type.STRING
        },
        intereses: {
            type: type.STRING
        },
        fotoRuta: {
            type: type.STRING
        }
    },{
        timestamps: false
    })
}

/*.asociate = (models) =>{
        usuario.hasMany(publicacion, {
            foreingKey: id_usuario,
            targetId: id           
        })
    }*/