const mongoose = require('mongoose');
const validator = require('validator');


const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true, // e.g., "Instagram"
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Invalid URL format',
    },
  },
  
});

module.exports = mongoose.model('Link', linkSchema);
