'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.cookies.token) {
    res.status(200).send(false);
  } else {
    res.status(200).send(true);
  }
})

router.post('/', (req, res, next) => {
  let email = req.body.email
  let password = req.body.password
  if (!email) {
    next(boom.create(400, "Email must not be blank"))
  } else if (!password) {
    next(boom.create(400, "Password must not be blank"))
  } else {
    knex('users')
      .where('email', email)
      .then((user) => {
        if (user.length > 0) {
          bcrypt.compare(password, user[0].hashed_password, function(err, boolean) {
            if (boolean) {
              const token = jwt.sign({
                email: user[0].email,
                password: user[0].hashed_password
              }, 'shhhhh');
              res.cookie('token', token, {
                httpOnly: true
              });
              console.log("THE DELETED PIECE", user[0].hashed_password);
              delete user[0].hashed_password;
              res.send(humps.camelizeKeys(user[0]));
            } else {
              next(boom.create(400, "Bad email or password"))
            }
          });

        } else {
          next(boom.create(400, "Bad email or password"))
        }
      })
  }
})
router.delete('/', (req, res, next) => {
  res.clearCookie('token')
  res.status(200)
  res.send();
})
function checkForAuthentification(req, res, next) {
  if (req.session.jwt) {
    jwt.verify(req.session.jwt, 'shhhh', function(err, decoded) {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  }
  else{
    res.sendStatus(403);
  }
}

module.exports = router;
