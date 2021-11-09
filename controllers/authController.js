const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

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

//Genera un token si el usuario es válido
exports.enviarToken = async (req, res) =>{
    //Verificar que el usuario exista
    const { email } = req.body;
    const usuario = await Usuarios.findOne({
        where: { email }
    });

    //Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    
    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //Guardarlos en la BD
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    console.log(resetUrl);
}

exports.validarToken = async (req, res) =>{
    // res.json(req.params.token);
    const { token } = req.params;
    const usuario = await Usuarios.findOne({
        where: {
            token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    
    
    //Si no encuentra el usuario
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

exports.actualizarPassword = async (req, res) => {
    const {token} = req.params;

    //Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token
        }
    });

    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //Hasehar el nuevo password
    usuario.password = bcrypt.hashSync( req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;

    //Guardar el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}