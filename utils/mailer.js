const  mailer = require('config/mailer');

 exports.sendMail =  async (from, to, subject, message) => {

    await mailer.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: message // html body
    });


};