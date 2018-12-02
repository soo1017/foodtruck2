var {User} = require('../models/user');

var findAdminUserWithToken = function(req, res, flag) {
    console.log("req: ", req);
    console.log("req.login: ", req.login);
    var path1, boolean1;
    if (flag == 'admin') {
        boolean1 = true;
    } else {
        boolean1 = false;
    }
    return function(callback) {
        User.findOne({ resetPasswordToken: req.params.token, isAdmin: boolean1 }, function(err, admin) {
            if (!admin) {
                var temp_msg = { info: 'No user found' };
                return res.send(JSON.stringify(temp_msg));
            }

            admin.password = admin.encryptPassword(req.body.password);
            admin.isAdmin = boolean1;
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpires = undefined;

            console.log("admin: ", admin);
            admin.save(function(err1) {
                req.logIn(admin, function(err2) {
                    console.log("err: ", err2);
                    callback(err2, admin);
                });
            });
        });
    }
}

module.exports = {findAdminUserWithToken};
