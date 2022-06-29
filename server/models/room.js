'use strict';

const mongoose = require('mongoose');

/* In case you want rooms to have names, limited users, etc... */
const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    maxLength: 20
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  ]
});

const Room = mongoose.model('Room', schema);

module.exports = Room;
