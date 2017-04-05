'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev'
  }
  ,
  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL 
  }
};
