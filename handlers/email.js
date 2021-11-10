const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const emailConfig = require('../config/email');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass, // generated ethereal password
    },
});

//Generar HTML
const generarHTML = (archivo, opciones = {}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: 'UpTask <no-reply@uptask.com>', // sender address
		to: opciones.usuario.email, // list of receivers
		subject: opciones.subject, // Subject line
		text,  // plain text body
		html   // html body
	});
}

