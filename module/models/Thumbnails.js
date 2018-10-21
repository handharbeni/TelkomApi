var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var ThumbnailsSchema = new mongoose.Schema({
  idUser: String,
  path: String,
  date: String
});
mongoose.model('Thumbnails', ThumbnailsSchema);

module.exports = mongoose.model('Thumbnails');