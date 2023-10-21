module.exports = (sequelize, type) => {
    return sequelize.define('etiquetas', {
        id_etiquetas: {
            type : type.INTEGER,
            primaryKey : true,
            autoincrement : true
        },
        etiqueta : {
            type: type.STRING            
        }
    },{
        timestamps : false
    })
}