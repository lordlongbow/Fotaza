module.exports = (sequelize, type) =>{
    return sequelize.define('categoria', {
        id_categoria: {
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