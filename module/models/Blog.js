var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var BlogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  date: String,
  dateModified: String,
  thumbnails: String,
  type: String,
  idUser: String
});
mongoose.model('Blog', BlogSchema);

module.exports = mongoose.model('Blog');