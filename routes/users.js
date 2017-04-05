'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      const body = humps.decamelizeKeys(req.body);
      const token = jwt.sign({
        email: body.email,
        password: hashed_password
      }, 'shhhhh');

      return knex('users')
        .returning(['first_name', 'last_name', 'email', 'id'])
        .insert({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          hashed_password: hashed_password
        })
        .then((user) => {
          res.cookie('token', token, {
            httpOnly: true
          });
          res.send(humps.camelizeKeys(user[0]));
        });
    });
});
module.exports = router;
