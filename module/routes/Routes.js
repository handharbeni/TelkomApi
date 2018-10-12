'use strict';
module.exports = function(app) {
    var controllers = require('../controllers/Controllers');
    var verifyToken = require('../controllers/VerifyToken');

    app.route('/tes')
        .get(controllers.test);
    app.route('/registers')
        .post(controllers.signup);
    app.route('/login')
        .post(controllers.signin);
    app.route('/logout')
        .get(controllers.signout);
    app.route('/me')
        .get(verifyToken, controllers.me);
}