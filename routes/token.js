'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
// eslint-disable-next-line new-cap
const router = express.Router();
// YOUR CODE HERE
router.get('/token', (req, res, next) => {
  console.log('Cookies: ', req.cookies)
  var visits = getCookie("counter");
  if (!visits) {
    visits = 1;
    console.log("By the way, this is your first time here.");
  } else {
    visits = parseInt(visits) + 1;
    console.log("By the way, you have been here " + visits + " times.");
  }
  var opts = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
   httpOnly: true
  };
  //res.clearCookie("counter", { path: '/token' });
  res.cookie('counter', 'visits', opts);

  //res.end();
})

router.post('/token', (req, res, next) => {

})
//
router.delete('/token', (req, res, next) => {

})
//

module.exports = router;
