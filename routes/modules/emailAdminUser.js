var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var configApp = require('../../config/configApp');

var emailAdminUser = function(req, res, flag) {
    var path1;
    if (flag == 'admin') {
        path1 = '/#/forgotpass/';
    } else {
        path1 = '/#/forgotpass/';
    }
    return function(token, user, callback) {
        var transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use TLS
            auth: {
                user: configApp.email,
                pass: configApp.password
            }
        });
        var mailOptions = {
            to: user.email,
            from: configApp.email,
            subject: 'Password Reset',
            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + path1 + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remian unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
            if (err) {
                var temp_err = {
                    info: 'No email sent'
                }
                return res.send(JSON.stringify(temp_err));
            }
            res.send('Ok');
        });
    }
}

module.exports = {emailAdminUser};


