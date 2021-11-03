const express = require('express');
const router = express.Router();

//importar express-validator
const { body } = require('express-validator');

//importar el controlador
const proyectosController = require('../controllers/proyectosController');

module.exports = function() {
    //ruta para el home
    router.get('/', proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //Listar Proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);
    
    return router;
}