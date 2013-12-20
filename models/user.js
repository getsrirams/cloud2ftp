var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var UserSchema = new Schema({
    name : { 
        first: { type: String, required: true } 
      , last: { type: String, required: true }
    }
  , email: { type: String, unique: true }
});


module.exports = mongoose.model('User', UserSchema);
