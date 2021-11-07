const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//Función para revisar si el usuario está logeado o no
exports.usuarioAutenticado = (req, res, next) =>{
    //Si el usuario está autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    //Si no está autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) =>{
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}