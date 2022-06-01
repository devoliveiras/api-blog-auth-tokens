const nodemailer = require('nodemailer');

class Email {
    async enviaEmail(){
        const contaTeste = await nodemailer.createTesteAccount();
        const transportador = nodemailer.creteTransport({
            host: 'smtp.ethereal.email',
            auth: contaTeste,
    
        });
        const info = await transportador.sendMail(this);
    
        console.log('URL: ' + nodemailer.getTestMessagerUrl(info));
    }    
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco){
        super();
        this.from = '"Guilherme Oliveira" <no-reply@devoliveiras.com>';
        this.to = usuario.email;
        this.subject = 'Verificaçaõ de Email';
        this.text = `Olá! Verifique seu e-mail aqui: ${endereco}`;
        this.html = `<h1>Olá!</h1> <br> Verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a>`;
    }
}



module.exports = { EmailVerificacao}