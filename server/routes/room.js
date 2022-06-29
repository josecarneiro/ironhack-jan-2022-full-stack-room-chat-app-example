'use strict';

const express = require('express');
const Message = require('../models/message');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Message.find({ room: id })
    .then((messages) => {
      res.json({ messages });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
