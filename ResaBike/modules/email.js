const nodemailer = require('nodemailer');
const striptags = require('striptags');

var self = module.exports = {

    createEmail(to, subject, html) {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: 'resabike.test@gmail.com',
                to: to,
                subject: subject,
                text: striptags(html),
                html: html
            };

            self.sendEmail(self.createTransporter(), mailOptions).then(() => {
                resolve()
            })
        });
    },
    createTransporter() {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'resabike.test@gmail.com',
                pass: 'Resabike12345'
            }
        });
        return transporter;
    },
    sendEmail(transporter, mailOptions) {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        })

    }
}