'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/books', (req, res, next) => {
  knex('books')
  .orderBy('title')
  .then(books => {
    res.send(humps.camelizeKeys(books));
  })
})
  router.get('/books/:id', (req, res, next) => {
    let id = req.params.id;
     let maxId = knex.raw("SELECT MAX(id) FROM books;")
    if(id > maxId || id < 0 || Number.isNaN(id)){
    return res.sendStatus(400)
  }else{
    knex('books')
    .where('id', id)
    .then(books => {
      res.send(humps.camelizeKeys(books[0]));
    })
  }


})

router.post('/books', (req, res, next) =>{
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
router.patch('/books/:id', (req, res, next) =>{
  let id = req.params.id;
  let body = req.body;
  knex('books')
  .where('id', id)
  .returning(['id','title', 'author', 'genre', 'description', 'cover_url'])
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
router.delete('/books/:id',(req, res, next)=>{
  let id = req.params.id;
  knex('books')
  .returning(['title', 'author', 'genre', 'description', 'cover_url'])
  .where('id', id)
  .del()
  .then(book =>{
    res.send(humps.camelizeKeys(book[0]));
  })
 })
//

module.exports = router;
