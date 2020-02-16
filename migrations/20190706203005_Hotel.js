
exports.up = async function(knex, Promise) {
    await knex.schema.hasTable("Hotel");
    return await knex.schema.createTable("Hotel", table=>{
        table.increments("id").primary,
        table.string("name"),
        table.string("image"),
        table.string("details"),
        table.string("price");
    });
  };
  
  exports.down = function(knex, Promise) {
    knex.schema.dropTable("Hotel");
  };
