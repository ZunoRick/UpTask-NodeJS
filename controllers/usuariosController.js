const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
	res.render('crearCuenta', {
		nombrePagina: 'Crear Cuenta en UpTask',
	});
};

exports.formIiniciarSesion = (req, res) => {
	const { error } = res.locals.mensajes;
	res.render('iniciarSesion', {
		nombrePagina: 'Inicia Sesión en UpTask',
		error
	});
};

exports.crearCuenta = async (req, res) => {
	//Leer los datos
	const { email, password } = req.body;

	try {
		//Crear el usuario
		await Usuarios.create({
			email,
			password,
		});

		//Crear una URL de confirmar
		const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

		//Crear el objeto de usuario
		const usuario = {
			email
		}

		//Enviar email
		await enviarEmail.enviar({
			usuario,
			subject: 'Confirma tu cuenta UpTask',
			confirmarUrl,
			archivo: 'confirmar-cuenta'
		});

		//Redigir al usuario
		req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
		res.redirect('/iniciar-sesion');
	} catch (error) {
        req.flash('error', error.errors.map( error => error.message));
		res.render('crearCuenta', {
            mensajes: req.flash(),
			nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
		});
	}
};

exports.formRestablecerPassword = (req, res) =>{
	res.render('reestablecer', {
		nombrePagina: 'Reestablece tu Contraseña'
	});
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) =>{
	const {correo} = req.params;
	const usuario =	await Usuarios.findOne({
		where: { email: correo }
	});

	if(!usuario){
		req.flash('error', 'No válido');
		res.redirect('/crear-cuenta');
	}

	usuario.activo = 1;
	await usuario.save();

	req.flash('correcto', 'Cuenta Activada. Ya puedes iniciar sesión');
	res.redirect('/iniciar-sesion');
}