var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var UserSchema = new mongoose.Schema({
  Phone: String,
  Name: String,
  Email: String,
  Password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');