var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var ThumbnailsSchema = new mongoose.Schema({
  idUser: String,
  Path: String,
  Date: String
});
mongoose.model('Thumbnails', ThumbnailsSchema);

module.exports = mongoose.model('Thumbnails');