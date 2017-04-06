'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then(books => {
      res.send(humps.camelizeKeys(books));
    })

})
router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  knex('books')
    .where('id', id)
    //this checks for invalid data, i.e. :id = 9000, -1, one
    .then(books => {
      if (!books) {
        return next(boom.create(404, "Not Found"))
      }
      res.send(humps.camelizeKeys(books[0]));
    })
})


router.post('/', (req, res, next) => {
  let body = req.body;
  console.log(body);
  knex('books')
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .insert({
      title: body.title,
      author: body.author,
      genre: body.genre,
      description: body.description,
      cover_url: body.coverUrl
    })
    .then(book => {
      res.send(humps.camelizeKeys(book[0]));
    })
})
//
router.patch('/:id', (req, res, next) => {
  let id = req.params.id;
  let body = req.body;
  knex('books')
    .where('id', id)
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .update({
      title: body.title,
      author: body.author,
      genre: body.genre,
      description: body.description,
      cover_url: body.coverUrl
    })
    .then(book => {
      res.send(humps.camelizeKeys(book[0]));
    })
})
//
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .returning(['title', 'author', 'genre', 'description', 'cover_url'])
    .where('id', id)
    .del()
    .then(book => {
      res.send(humps.camelizeKeys(book[0]));
    })
})
//

module.exports = router;
