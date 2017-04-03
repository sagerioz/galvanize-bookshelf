'use strict';
const bcrypt = require('bcrypt-as-promised')
const express = require('express')
const humps = require('humps')
const knex = require('../knex')
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
   .then((hashed_password) => {
   let body = humps.decamelizeKeys(req.body)
    return knex('users')
   .returning(['first_name', 'last_name', 'email', 'id'])
   .insert({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    hashed_password: hashed_password
  })
  .then(user => {
    res.send(humps.camelizeKeys(user[0]));
  })
})
})
module.exports = router;
