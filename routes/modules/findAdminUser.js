var {User} = require('../models/user');

var findAdminUser = function(req, res, flag) {
    var path1, boolean1;
    if (flag == 'admin') {
        boolean1 = true;
    } else {
        boolean1 = false;
    }
    return function(token, callback) {
        User.findOne({email: req.body.email, isAdmin: boolean1}, function(err, user) {
            if (!user) {
                var temp_msg = { info: 'No user found' };
                return res.send(JSON.stringify(temp_msg));
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 600000;        // 10 mins

            user.save(function(err) {
                callback(err, token, user);
            });
        });
    }
}

module.exports = {findAdminUser};
