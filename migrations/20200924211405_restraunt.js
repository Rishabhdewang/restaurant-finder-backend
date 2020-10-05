
exports.up = function(knex) { 
    return knex.schema.createTable("restaurants" , (t1) => {
        t1.increments("id").primary();
        t1.string("Name").notNullable().unique();
        t1.string("Location").notNullable();
        t1.integer("PriceRange").notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("restaurants");
  
};
