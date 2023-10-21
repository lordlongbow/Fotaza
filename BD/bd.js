const Sequelize = require('sequelize');

//Modelos
const UsuarioModel = require('../models/usuario');
const PublicacionModel = require('../models/publicaciones');
const DerechosModel = require('../models/derechos');
const CategoriaModels = require('../models/categoria');
const ComentarioModel = require('../models/comentario');
const valoracionesModel = require('../models/valoraciones');
const mensajesModel = require('../models/mensajes');

const sequelize = new Sequelize('fotaza', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

//Tablas

const usuario = UsuarioModel(sequelize, Sequelize);
const publicacion = PublicacionModel(sequelize, Sequelize);
const derechos = DerechosModel(sequelize, Sequelize);
const categoria = CategoriaModels(sequelize, Sequelize);
const comentario = ComentarioModel(sequelize, Sequelize);
const valoraciones = valoracionesModel(sequelize, Sequelize);
const mensajes = mensajesModel(sequelize, Sequelize);
//Relaciones

usuario.hasMany(publicacion, { foreignKey: 'id_usuario' });
publicacion.belongsTo(usuario, { foreignKey: 'id_usuario' });
categoria.hasMany(publicacion, { foreignKey: 'id_categoria', as: 'publicacion' });
publicacion.belongsTo(categoria, { foreignKey: 'id_categoria', as: 'categoria' });
publicacion.belongsTo(derechos, { foreignKey: 'id_derechos', as: 'derechos' });
derechos.hasMany(publicacion, { foreignKey: 'id_derechos' });
usuario.hasMany(comentario, { foreignKey: 'id_usuario', as: 'comentarios' });
publicacion.hasMany(comentario, { foreignKey: 'id_publicacion', as: 'comentario' });
comentario.belongsTo(usuario, { foreignKey: 'id_usuario', as: 'usuario' });
comentario.belongsTo(publicacion, { foreignKey: 'id_publicacion' });
publicacion.hasMany(valoraciones, { foreignKey: 'id_publicacion', as: 'valoraciones' });
valoraciones.belongsTo(publicacion, { foreignKey: 'id_publicacion' });
usuario.hasMany(valoraciones, { foreignKey: 'id_usuario', as: 'valoracion' })
valoraciones.belongsTo(usuario, { foreignKey: 'id_usuario' });


usuario.hasMany(mensajes, { foreignKey: 'id_usuario', as: 'mensajesEnviados' });
usuario.hasMany(mensajes, { foreignKey: 'remitente', as: 'mensajesRecibidos' });
mensajes.belongsTo(usuario, { foreignKey: 'id_usuario', as: 'emisor' });
mensajes.belongsTo(usuario, { foreignKey: 'remitente', as: 'receptor' });




sequelize.sync({ force: false }).then(() => { console.log('todo funcando') });

module.exports = {
  usuario,
  publicacion,
  derechos,
  categoria,
  comentario,
  valoraciones,
  mensajes,
  sequelize
}