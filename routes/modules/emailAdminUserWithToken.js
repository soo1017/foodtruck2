var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var configApp = require('../../config/configApp');

var emailAdminUserWithToken = function(req, res, flag) {
    var path1;
    if (flag == 'admin') {
        path1 = '/#/forgotpass/';
    } else {
        path1 = '/#/forgotpass/';
    }
    return function(admin, callback) {
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
            to: admin.email,
            from: configApp.email,
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + admin.email + ' has just been changed.\n'
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

module.exports = {emailAdminUserWithToken};

//Sample code:
//var email_smtp = nodemailer.createTransport({      
//  host: "smtp.gmail.com",
//  auth: {
//    type: "OAuth2",
//    user: "youremail@gmail.com",
//    clientId: "CLIENT_ID_HERE",
//    clientSecret: "CLIENT_SECRET_HERE",
//    refreshToken: "REFRESH_TOKEN_HERE"                              
//  }
//});
//And if you still want to use just plain text password, disable secure login on your google account and use as follows:
//
//var email_smtp = nodemailer.createTransport({      
//  host: "smtp.gmail.com",
//  auth: {
//    type: "login", // default
//    user: "youremail@gmail.com",
//    pass: "PASSWORD_HERE"
//  }
//});