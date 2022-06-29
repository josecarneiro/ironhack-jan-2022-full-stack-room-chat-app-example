'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    maxLength: 1000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  room: {
    type: String
  }
});

const Message = mongoose.model('Message', schema);

module.exports = Message;
