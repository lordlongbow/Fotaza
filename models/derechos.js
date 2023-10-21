module.exports = (sequelize, type) =>{
    return sequelize.define('derechos', {
        id_derechos: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: type.STRING
        }
    },{
        timestamps : false
    })
}