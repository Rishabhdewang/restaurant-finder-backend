const router = require("express").Router();
const auth = require("../controllers/auth");
const crud = require("../controllers/crud");
const authenticate = require('../middleware/jwtverification');

router.get('/allRestaurants',authenticate.authenticateToken,crud.allRestaurants);
router.get('/Restaurant/:id',crud.Restaurant);
router.get('/ratingData', crud.RatingData);
router.post('/createRestaurant',crud.createRestaurants);
router.delete('/deleteRestaurant/:id',crud.deleteRestaurants);
router.put('/updateRestaurant/:id',crud.updateRestaurants);
router.post('/Restaurant/:id/addreview',crud.AddReview);


// router.get('/allRestaurants',crud.allRestaurants);
// router.get('/Restaurant/:id',crud.Restaurant);
// router.get('/ratingData', crud.RatingData);
// router.post('/createRestaurant',crud.createRestaurants);
// router.delete('/deleteRestaurant/:id',crud.deleteRestaurants);
// router.put('/updateRestaurant/:id',crud.updateRestaurants);
// router.post('/Restaurant/:id/addreview',crud.AddReview);


router.post('/SignUp', auth.SignUp)
router.post('/Login', auth.Login)
router.get('/AllUser', auth.AllUser)

module.exports = router;