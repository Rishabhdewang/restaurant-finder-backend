const restrau = require('../models/restaurantmodel');
const reviews = require('../models/reviewmodel');
const {
    fn
} = require('objection');
const knex = require('knex')

const {
    to
} = require('../global_functions');
const {
    response
} = require('express');
const {
    param
} = require('../routes/route');
const {
    raw
} = require('body-parser');
// const { fn } = require('sequelize/types');


//create
const createRestaurants = async (req, res) => {

    let name = req.body.Name;
    let location = req.body.Location;
    let pricerange = req.body.PriceRange;

    const [notcreated, created] = await to(restrau.query().insert({
        Name: name,
        Location: location,
        PriceRange: pricerange
    }));
    if (notcreated) {
        return console.log(notcreated), res.status(401).send(notcreated);
    }

    res.json({
        success: "true",
        created
    });

}

//update
const updateRestaurants = async (req, res) => {
    const id = req.params.id;
    const [notupdated, updated] = await to(restrau.query().findById(id).patch(req.body));
    if (notupdated) return res.status(400).send(notupdated), console.log(notupdated);
    else {
        res.json({
            success: "true",
            Updated: [updated]
        });
    }
}

//delete
const deleteRestaurants = async (req, res) => {

    const [notdeleted, deleted] = await to(restrau.query().deleteById(req.params.id));
    if (notdeleted) return res.status(401).send(notdeleted);
    else {
        res.sendStatus(200);
        console.log("Succesfully deleted")
    }
}

//get All Restaurants

const allRestaurants = async (req, res) => {

    // const [err, Restaurants] = await to(restrau.query().select(knex.raw(' * from restaurants left join (select "RestaurantId" , COUNT(*),avg("Ratings") as avgRating from reviews  group by "RestaurantId") reviews on restaurants.id = reviews."RestaurantId"')).returning("*"));
    const [err, Restaurants] = await to( restrau.query()
        .withGraphFetched("[test(Groupby)]")
        .modifiers({
            Groupby(builder) {
                builder.count("id")
                    .avg("Ratings")
                    .groupBy("RestaurantId");
            }
        }))
    if (err) return res.status(400).send(err), console.log(err)

    res.status(201);
    res.json({
        success: "true",
        // test
        Restaurants,
        // sasa  : restaurantRatingData
    });
}

// Restaurant by id 
const Restaurant = async (req, res) => {

    const [notfound, found] = await to(restrau.query().findById(req.params.id));
    if (notfound) return res.status(400).send(notfound);

    const [err, review] = await to(reviews.query().where("RestaurantId", req.params.id).returning('*'))
    console.log(review)
    if (err) return res.status(401).send(err);


    const noOfReview = await reviews.query().count("Review").where("RestaurantId", req.params.id);
    const avgRating = await reviews.query()
        .select(knex.raw('Round(avg("Ratings"),1)'))
        .where("RestaurantId", req.params.id);

    res.json({
        success: "true",
        Restrua: found,
        Newreview: review,
        noOfReview: noOfReview,
        avgRating: avgRating
    });
}

const AddReview = async (req, res) => {

    let RestaurantId = req.params.id;
    let Name = req.body.UserName;
    let Ratings = req.body.Ratings;
    let Review = req.body.Review;

    const [err, data] = await to(reviews.query().insert({
        RestaurantId,
        UserName: Name,
        Ratings,
        Review

    }).returning('*'));

    console.log(data)

    if (err) return res.status(400).send(err);

    res.sendStatus(201).json({
        success: "true",
        newreview: {
            r: data.rows
        }

    });
}

const RatingData = async (req, res) => {

    // select * from restaurants left join (select RestaurantId , COUNT(*), TRUNC(Avg(Ratings),1) as avgRating from reviews 
    // // group by RestaurantId) reviews on Restaurant.id = reviews.RestaurantId;


    // const review = await reviews.query().count("Review").where("RestaurantId",req.params.id);
    // const avgRating = await reviews.query().select(knex.raw('Round(avg("Ratings"),1)')) ;
    try {


        // const test = await restrau.query().innerJoin('reviews' ,'restaurants.id', 'reviews.RestaurantId');
        const test = await restrau.query()
            .withGraphFetched("[test(Groupby)]")
            .modifiers({
                Groupby(builder) {
                    builder.count("id").avg("Ratings").groupBy("RestaurantId");
                }
            })

        // console.log(review)
        res.send(test)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
    // const [er, restruId] = await to(reviews
    //                                 .query()
    //                                 .select(raw("RestaurantId" ,fn.avg('Ratings')))
    //                                 .groupBy("RestaurantId")
    //                                     // ('reviews.Review' = "RestaurantId")

    //                                 // .where("RestaurantId", req.params.id)
    //                                 )
    // if (er) return res.send(er)

    // res.send(restruId)
}

module.exports = {
    createRestaurants,
    deleteRestaurants,
    updateRestaurants,
    allRestaurants,
    Restaurant,
    AddReview,
    RatingData
}