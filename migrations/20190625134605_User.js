
exports.up = async function(knex, Promise) {
    await knex.schema.hasTable("User");

    return await knex.schema.createTable("User", table => {
      table.increments("id").primary(),
        table.string("name"),
        table.string("phone"),
        table.string("address"),
        table.string("email"),
        table.string("password");
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable("User");
  
};