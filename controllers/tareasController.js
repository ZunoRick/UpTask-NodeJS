const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea =async (req, res, next) =>{
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({ 
        where: { url: req.params.url}
    });

    //Leer el valor del input
    const { tarea } = req.body;

    //estado 0= inclompleto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la BD
    const resultado = await Tareas.create({tarea, estado, proyectoId});
    if (!resultado) {
        return next();
    }

    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) =>{
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where:{ id }
    });
    
    //Cambiar el estado
    let estado = 0;
    tarea.estado = (tarea.estado === estado) ? 1 : 0;

    const resultado = await tarea.save();
    if (!resultado) return next();

    res.status(200).send('Actualizado...');
}

exports.eliminarTarea = async (req, res, next) => {
    // console.log(req.query);
    const {id} = req.params;

    const resultado = await Tareas.destroy({ where: { id }});

    if (!resultado) return next();
    
    res.status(200).send('Tarea Eliminada Correctamente');
}