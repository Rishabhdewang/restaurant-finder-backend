
exports.up = function(knex) {
    return knex.schema.createTable("user" , (t3) => {
        t3.increments("id").primary();
        t3.string("Email").notNullable().unique();
        t3.string("Password").notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("user")
};
