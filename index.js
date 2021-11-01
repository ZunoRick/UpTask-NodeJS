const express = require('express');
const routes = require('./routes/index');

//Crear una aplicación de express
const app = express();

app.use('/', routes());

app.listen(4000);