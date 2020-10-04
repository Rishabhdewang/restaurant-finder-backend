const { Model } = require("objection");

class Restaurant extends Model{
    static get tableName(){
        return "restaurants"
    }

    static get relationMappings(){

        const reviews = require('./reviewmodel');
        return {
            test : {
                relation : Model.HasManyRelation,
                modelClass : reviews,
                join : {
                    from : "restaurants.id",
                    to : "reviews.RestaurantId"
                }

            }
        }
    }
}

module.exports = Restaurant;