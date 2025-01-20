const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePicUrl: {
    type: String,
    required: true,
  },
  linkTreeUrl: {
    type: String, // e.g., "http://linky/username"
    unique: true,
    default: null, // Default to null if not provided
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
