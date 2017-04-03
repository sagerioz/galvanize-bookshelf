'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const boom = require('boom');

// eslint-disable-next-line new-cap
const router = express.Router();
// YOUR CODE HERE
router.get('/', (req, res, next) => {
  //console.log('Cookies: ', req.cookies)
  if(!req.cookies.token){
res.status(200).send(false);
}else{
  res.status(200).send(true);
}
// res.setHeader('content-type', 'json');
  //res.clearCookie("counter", { path: '/token' });
//res.cookie('counter', { foo: 'bar', bazz: 'buzz'});
// res.end();
})

router.post('/', (req, res, next) => {
      console.log("REQ BODY", req.body);
      let email = req.body.email
      let password = req.body.password
      console.log("EMAIL ", email);
      knex('users')
        .where('email', email)
        .then((user) => {
          if (user.length > 0) {
            console.log("USER", user);

            //bcrpt compare
            bcrypt.compare(password, user[0].hashed_password, function(err, boolean) {
              if (boolean) {
                var token = jwt.sign({
                  email: user[0].email,
                  password: user[0].hashed_password
                }, 'shhhhh');
                res.cookie('token', token, {
                  httpOnly: true
                });
                console.log("THE DELETED PIECE", user[0].hashed_password);
                delete user[0].hashed_password;
                res.send(humps.camelizeKeys(user[0]));
              }else{
                next(boom.create(400, "Bad email or password"))
              }
            });

          }else{
            next(boom.create(400, "Bad email or password"))
          }

          //
          //
          // res.cookie()
        })
//res.cookie('counter', { foo: 'bar', bazz: 'buzz'});

})
//
router.delete('/', (req, res, next) => {
  res.clearCookie('token')
  res.status(200)
res.send();
})
//
function checkForAuthentification(req,res,next) {
  if (req.session.jwt) {
    jwt.verify(req.session.jwt, 'shhhh', function(err, decoded) {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
