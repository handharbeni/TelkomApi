'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('../../utils/db');
var config = require('../../utils/config');
var User = require('../../module/models/User');
var Thumbnails = require('../../module/models/Thumbnails');
var Files = require('../../module/models/Files');


exports.test = function(req, res){
    res.status(200).send({'results':'empty'});
}
exports.signup = function(req, res){
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        phone: req.body.phone,
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    }, function (err, user) {
        if (err) return res.status(500).send({ auth: false, token: 'There was a problem registering the user.' });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    }); 
}
exports.signin = function(req, res){
    User.findOne({ phone: req.body.phone }, function (err, user) {
        if (err) return res.status(500).send({ auth: false, token: 'Error on the server.' });
        if (!user) return res.status(404).send({ auth: false, token: 'No user found.' });

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!passwordIsValid) return res.status(404).send({ auth: false, token: null });
        
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
}

exports.me = function(req, res, next){
    res.status(200).send({
        auth: true,
        message: req.userId
    });
}

exports.uploadFile = function(req, res, next){
    Files.create({
        idUser: req.userId,
        path: '/home/mhandharbeni/Documents/PROJECT/Irtak/telkom/TelkomApi/'+req.file.path,
        date: Date.now()
    }, function(err, file){
        if(err) return res.status(500).send({auth:true, message:err});
        if(!err) return res.status(200).send({auth:true, message:'Upload Success'});
    });
}

exports.uploadThumbnails = function(req, res, next){
    Thumbnails.create({
        idUser: req.userId,
        path: '/home/mhandharbeni/Documents/PROJECT/Irtak/telkom/TelkomApi/'+req.file.path,
        date: Date.now()
    }, function (err, thumbs){
        if(err) return res.status(500).send({auth:true, message:err});
        if(!err) return res.status(200).send({auth:true, message:'Upload Success'});
    });
    // res.status(200).send({auth:true, message: req.file});
}
exports.getFiles = function(req, res, next){
    Files.find({idUser: req.userId}, function(err, results){
        if(err) return res.status(404).send({auth:true, message:'Failed to get Files'});
        res.status(200).send({auth: true, message:results});
    });
}
exports.getThumbs = function(req, res, next){
    Thumbnails.find({idUser: req.userId}, function(err, results){
        if(err) return res.status(404).send({auth:true, message:'Failed to get Thumbs'});
        res.status(200).send({auth: true, message:results});
    });
}
exports.signout = function(req, res){
    res.status(200).send({ auth: false, token: null });
}

exports.blog = function(req, res){
    res.status(200).send({auth: false, token:null});
}

exports.restriction = function(req, res){
    res.status(500).send({auth: false, message:'You Dont Have Any Privileges To See Here'});
}