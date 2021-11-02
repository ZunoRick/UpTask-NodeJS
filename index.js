const express = require('express');
const routes = require('./routes/index');
const path = require('path');

//Crear la conexión a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');

db.sync()
    .then( () => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//Crear una aplicación de express
const app = express();

//Donde cargar los archivos estáticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Habilitar la lectura de fornularios
app.use(express.urlencoded({ extended: true }));

app.use('/', routes());

app.listen(4000);