'use strict';
/**
 * Utils, Library
 */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('../../utils/db');
var config = require('../../utils/config');
var Files = require('../../module/models/Files');
var fs = require('fs');
var mime = require('mime-types');

/**
 * Model
 */
var User = require('../../module/models/User');
var Thumbnails = require('../../module/models/Thumbnails');
var Blog = require('../../module/models/Blog');

// var readChunk = require('read-chunk');
// var fileType = require('file-type');

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
        message: req.body
    });
}

exports.uploadFile = function(req, res, next){
    // var paths = (process.cwd()+"/"+req.file.path).replace(/\\/g,"/")
    Files.create({
        idUser: req.userId,
        path: (req.file.path).replace(/\\/g,"/"),
        date: Date.now()
    }, function(err, file){
        if(err) return res.status(500).send({auth:true, message:err});
        if(!err) return res.status(200).send({auth:true, message:'Upload Success'});
    });
}

exports.uploadThumbnails = function(req, res, next){
    Thumbnails.create({
        idUser: req.userId,
        path: (req.file.path).replace(/\\/g,"/"),
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

exports.viewFiles = function(req, res){
    const url = require('url');
    const fileUrl = require('file-url');
    Files.findOne({_id: req.params.idFiles}, function(err, results){
        const myURL = url.parse(fileUrl(results.path));
        // const filePath = (myURL.href).replace(/\\/g,"/");
        fs.readFile(results.path, (err, data) => {
            if(err) return res.status(404).send({auth:true, message:'Failed to get Files'});
            res.writeHead(200, {'Content-Type': mime.lookup(results.path)});
            res.end(data);
        });    
    });
}

exports.viewThumbnails = function(req, res){
    const url = require('url');
    const fileUrl = require('file-url');
    Thumbnails.findOne({_id: req.params.idThumbnails}, function(err, results){
        // const myURL = url.parse(fileUrl(results.path));
        fs.readFile(results.path, (err, data) => {
            if(err) return res.status(404).send({auth:true, message:'Failed to get Files'});
            res.writeHead(200, {'Content-Type': mime.lookup(results.path)});
            res.end(data);
        });    
    });
}

exports.getThumbs = function(req, res, next){
    Thumbnails.find({idUser: req.userId}, function(err, results){
        if(err) return res.status(404).send({auth:true, message:'Failed to get Thumbs'});
        res.status(200).send({auth: true, message:results});
    });
}


exports.saveBlog = function(req, res, next){
    var property = {
        Title: req.body.title,
        Description: req.body.description,
        Content: req.body.content,
        Date: Date.now(),
        DateModified: Date.now(),
        Thumbnails: req.body.thumbnails,
        IdUser: req.userId
    };

    Blog.findOne(property, function(err, results){
        if(err) return res.status(404).send({auth:true, message:'Failed to get Blog'});
        if(results){
            res.status(404).send({auth:true, message:'Blog Already On This Scope'});
        }else{
            Blog.create(property, function(err, success){
                if(err) return res.status(404).send({auth:true, message:'Failed to get Blog'});

                res.status(200).send({auth:true, message:'Blog Saved'})
            });
        }
    });
}

exports.getBlog = function(req, res, next){
    Blog.find({}, function(err, results){
        if(err) return res.status(404).send({auth:true, message:'Failed to get Blogs'});
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