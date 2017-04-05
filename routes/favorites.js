'use strict';
const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const boom = require('boom');

const router = express.Router();

router.get('/', (req, res, next) => {
  if(!req.cookies.token){
    return next(boom.create(401, "Unauthorized"))
  }
  knex('favorites')
  .join('books', 'books.id', 'favorites.book_id')
  .then((favs) => {
    res.send(humps.camelizeKeys(favs));
  })
})

router.get('/check', (req, res, next) => {
  console.log("USER ID", req.query);
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"))
  }
    let id = +req.query.bookId
    knex('favorites')
      .where('book_id', id)
      .then((fav) => {
        if (fav.length === 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      })
})

router.post('/', (req, res, next) => {
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"))
  }
  let id = req.body.bookId
  knex('favorites')
  .insert({
    book_id: id,
    user_id: 1
  })
  .returning('*')
  .then(newFav => {
    res.send(humps.camelizeKeys(newFav[0]));
  })
})


router.delete('/', (req, res, next) => {
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"))
  }
  let id = req.body.bookId;
  knex('favorites')
    .returning('*')
    .where('book_id', id)
    .del()
    .then(book => {
      delete book[0].id
      res.send(humps.camelizeKeys(book[0]));
    })

})
module.exports = router;
