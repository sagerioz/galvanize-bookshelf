'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(bodyParser.json());
//app.use(expressJWT({ secret: 'sagerioz'}));

app.use(cookieParser())

app.get('/', function(req, res) {
  console.log('Cookies: ', req.cookies)
 //
 //
 //  var visits = getCookie("counter");
 //  maxAge = 24 * 60 * 60 * 1000;
 //  if (!visits) {
 //    visits = 1;
 //    console.log("By the way, this is your first time here.");
 //  } else {
 //    visits = parseInt(visits) + 1;
 //    console.log("By the way, you have been here " + visits + " times.");
 //  }
 //  var opts = {
 //    maxAge: 24 * 60 * 60 * 1000, // 24 hours
 //   httpOnly: true
 // };
 // res.clearCookie("counter", { path: '/' });
 //res.cookie('counter', visits, opts);
})


const path = require('path');

app.use(express.static(path.join('public')));

// CSRF protection
app.use((req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

const books = require('./routes/books');
const favorites = require('./routes/favorites');
const token = require('./routes/token');
const users = require('./routes/users');

app.use(books);
app.use(favorites);
app.use(token);
app.use(users);

app.use((_req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
