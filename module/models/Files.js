var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var FilesSchema = new mongoose.Schema({
  idUser: String,
  path: String,
  date: String
});
mongoose.model('Files', FilesSchema);

module.exports = mongoose.model('Files');