
exports.up = function(knex) {
    return knex.schema.createTable("reviews", (t2) => {
        t2.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        t2.integer("RestaurantId").references("id").inTable('restaurants').notNullable().onDelete('CASCADE');
        t2.string("UserName").notNullable();
        t2.integer("Ratings").notNullable();
        t2.text("Review");
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExits("reviews");
  
};
