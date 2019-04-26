"use strict";
const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD // generated ethereal password
        }
    });

module.exports = mailer;