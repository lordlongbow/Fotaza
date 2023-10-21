var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var sequelize = require('sequelize');
var fileUpload = require('express-fileupload');
var uuid = require('uuid');
var debug = require('debug')('proyecto:server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var jimp = require('jimp')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var publicacionRouter = require('./routes/publicacion');
var loginRouter = require('./routes/login');
var comnetarioRouter = require('./routes/comentario');
var valoracionesRouter = require('./routes/valoraciones');
var mensajesRouter = require('./routes/mensajes');
var categoriasRouter = require('./routes/categorias');
var derechosRouter = require("./routes/derechos");
var app = express();

//var server = http.createServer(app);
//var io = socketIO(server);






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

app.use(logger('dev'));
app.use(express.json());
app.use(sequelize);
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'imagenes')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//app.use(sharp);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/publicacion', publicacionRouter);
app.use('/login', loginRouter);
app.use('/comentario', comnetarioRouter);
app.use('/valoraciones', valoracionesRouter);
app.use('/mensajes', mensajesRouter);
app.use('/categorias', categoriasRouter);
app.use('/derechos', derechosRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//intento de uso de websocket

//connection el usuario o cliente se conecta 
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Envio un mensaje
  socket.on('mensaje', (data) => {
    console.log(`Mensaje recibido: ${data}`);
    
    // Emito el mensaje 
    io.emit('mensaje', data);
  });

  // disconnect el usuario o cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

});  

module.exports = app;

