'use strict';
var multer  = require('multer');

var storageThumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/thumbnails/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
    }
  })
var storageVideos = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/files/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
    }
  })
  
var uploadThumbnail = multer({ storage: storageThumbnail })
var uploadVideos = multer({ storage: storageVideos })
// var upload = multer({ dest: 'uploads/' })
module.exports = function(app) {
    var controllers = require('../controllers/Controllers');
    var verifyToken = require('../controllers/VerifyToken');
    /**
     * Header --
     * Content-Type = application/x-www-form-urlencoded
     * 
     * Field --
     * phone number
     * name
     * email
     * password
     */
    app.route('/register')
        .post(controllers.signup)
        .get(controllers.restriction)
        .put(controllers.restriction)
        .delete(controllers.restriction);
    /**
     * Header --
     * Content-Type = application/x-www-form-urlencoded
     * 
     * Field --
     * phone number
     * password
     */
    app.route('/login')
        .post(controllers.signin)
        .get(controllers.restriction)
        .put(controllers.restriction)
        .delete(controllers.restriction);
    /**
     * Header --
     * Content-Type = application/x-www-form-urlencoded
     * access-token = baSj19uSNAdJlsiuSN9ayePFalR7CX2v_WrsTJgLmaw
     */
    app.route('/logout')
        .get(controllers.signout)
        .post(controllers.restriction)
        .put(controllers.restriction)
        .delete(controllers.restriction);
    /**
     * Header --
     * Content-Type = application/x-www-form-urlencoded
     * access-token = baSj19uSNAdJlsiuSN9ayePFalR7CX2v_WrsTJgLmaw
     * 
     */
    app.route('/me')
        .get(verifyToken, controllers.me)
        .post(controllers.restriction)
        .put(controllers.restriction)
        .delete(controllers.restriction);
    /**
     * Header
     * Content-Type = multipart/form-data
     * access-token = baSj19uSNAdJlsiuSN9ayePFalR7CX2v_WrsTJgLmaw
     * 
     * Field --
     * files
     */
    app.route('/files')
        .post(verifyToken, uploadVideos.single('files'), controllers.uploadFile)
        .get(verifyToken, controllers.getFiles)
        .put(controllers.restriction)
        .delete(controllers.restriction);
    /**
     * Header
     * Content-Type = multipart/form-data
     * access-token = baSj19uSNAdJlsiuSN9ayePFalR7CX2v_WrsTJgLmaw
     * 
     * Field --
     * thumbnails
     */
    app.route('/thumbnails')
        .post(verifyToken, uploadThumbnail.single('thumbnails'), controllers.uploadThumbnails)
        .get(verifyToken, controllers.getThumbs)
        .put(controllers.restriction)
        .delete(controllers.restriction);

    /**
     * Field --
     * id
     */
    app.route('/viewFiles/:idFiles')
        .get(controllers.viewFiles);


}