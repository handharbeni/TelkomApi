var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var FilesSchema = new mongoose.Schema({
  idUser: String,
  Path: String,
  Date: String
});
mongoose.model('Files', FilesSchema);

module.exports = mongoose.model('Files');