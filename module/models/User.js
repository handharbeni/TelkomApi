var mongoose = require('mongoose');  
// var db = require('../../utils/db');
var UserSchema = new mongoose.Schema({
  phone: String,
  name: String,
  email: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');