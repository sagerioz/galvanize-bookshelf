exports.up = function(knex) {
  // create table
  return knex.schema.createTable('books', (table) => {
    table.increments();
    table.string('title', 255).notNullable().defaultTo('');
    table.string('author', 255).notNullable().defaultTo('');
    table.string('genre', 255).notNullable().defaultTo('');
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('books');
};
