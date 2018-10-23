var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var BlogSchema = new mongoose.Schema({
  Title: String,
  Description: String,
  Content: String,
  Date: String,
  DateModified: String,
  Thumbnails: String,
  IdUser: String
});
mongoose.model('Blog', BlogSchema);

module.exports = mongoose.model('Blog');