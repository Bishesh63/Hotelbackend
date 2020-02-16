
exports.up = async function(knex, Promise) {
    await knex.schema.hasTable("Booking");
    return await knex.schema.createTable("Booking", table=>{
        table.increments("id").primary,
        table.string("name"),
        table.date("date_from"),
        table.date("date_to")
        table.string("hotel_name");
    });
  };
  
  exports.down = function(knex, Promise) {
    knex.schema.dropTable("Booking");
  };
