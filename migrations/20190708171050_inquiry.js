
exports.up = async function(knex, Promise) {
    await knex.schema.hasTable("inquiry");
    return await knex.schema.createTable("inquiry", table=>{
        table.increments("id").primary,
        table.string("email"),
        table.string("contact"),
        table.string("message");
    });
  };
  
  exports.down = function(knex, Promise) {
    knex.schema.dropTable("inquiry");
  };


