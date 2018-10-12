'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('../../utils/db');
var config = require('../../utils/config');
var User = require('../../module/models/User');
var VerifyToken = require('./VerifyToken');


exports.test = function(req, res){
    res.status(200).send({'results':'empty'});
}
exports.signup = function(req, res){
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    }); 
}
exports.signin = function(req, res){
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(600).send('Error on the server.');
        if (!user) return res.status(504).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
}

exports.me = function(req, res){
    // var token = req.headers['access-token'];
    // if (!token) return res.status(201).send({ auth: false, message: 'No token provided.' });
    
    // jwt.verify(token, config.secret, function(err, decoded) {
        // if (err) return res.status(202).send({ auth: false, message: 'Failed to authenticate token.' });
        res.status(200).send(req);
        // next.id
        // User.findById(req.userId, 
        //     { password: 0 }, // projection
        //     function (err, user) {
        //       if (err) return res.status(504).send("There was a problem finding the users.");
        //       if (!user) return res.status(504).send("No user founds.");
        //       res.status(200).send(user);
        // });
    // });
}

exports.signout = function(req, res){
    res.status(200).send({ auth: false, token: null });
}
// jwt.verify(token, config.secret, function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
//     res.status(200).send(decoded);
// });
