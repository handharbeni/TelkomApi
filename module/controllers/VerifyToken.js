var jwt = require('jsonwebtoken');
var config = require('../../utils/config');
var User = require('../../module/models/User');


function verifyToken(req, res, next) {
  var token = req.headers['access-token'];
  if (!token) return res.status(201).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) res.status(203).send({ auth: false, message: 'Failed to authenticate token.' });
    // req.userId = decoded.id;

    User.findById(decoded.id, 
        { password: 0 }, // projection
        function (err, user) {
          if (err) return res.status(504).send("There was a problem finding the user.");
          if (!user) return res.status(504).send("No user found.");
          req = user;
    });

    next();
  });
}
module.exports = verifyToken;