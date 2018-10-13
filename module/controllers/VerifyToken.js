'use strict';
var jwt = require('jsonwebtoken');
var config = require('../../utils/config');
var db = require('../../utils/db');
var User = require('../../module/models/User');


function verifyToken(req, res, next) {
  var token = req.headers['access-token'];
  if (!token) return res.status(201).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) res.status(203).send({ auth: false, message: 'Failed to authenticate token.' });
    var userId = decoded.id;
    User.findOne({ _id: userId },
        function (err, user) {
          if (err) return res.status(201).send({ auth: false, message: 'There was a problem finding the user.' });
          if (!user) return res.status(201).send({ auth: false, message: 'No user found.' });
        }
    );
    req.userId = decoded.id;
    
    next();
  });
}
module.exports = verifyToken;