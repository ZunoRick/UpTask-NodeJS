const express = require('express');
const routes = require('./routes/index');
const path = require('path');

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