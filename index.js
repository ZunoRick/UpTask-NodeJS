const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Crear la conexión a la base de datos
const db = require('./config/db');

//helpers con algunas funciones
const helpers = require('./helpers');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then( () => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//Crear una aplicación de express
const app = express();

//Donde cargar los archivos estáticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Habilitar la lectura de fornularios
app.use(express.urlencoded({ extended: true }));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Sessiones nos permiten navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', routes());

app.listen(3000);