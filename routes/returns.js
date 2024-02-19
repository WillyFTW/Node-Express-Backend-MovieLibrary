//handle returned rentals and edit the rental accordingly
const Joi = require("joi");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const {Rental} = require("../models/rental");
const {Movie} = require("../models/movie");
const express = require("express");
const router = express.Router();



router.post("/", [auth, validate(validateReturn)], async (req, res) => {

    //look if rental exists
    //we call the static function we created in rental model. so we dont need to: new Rental().lookup(...);
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if(!rental) return res.status(404).send("Rental not found.");
    //look if return already processed
    if (rental.dateReturned) return res.status(400).send("Return already processed");
    //set return date of rental
    //check ammount of rental days and calculate rental fee
    rental.return(); //is a method defined in rental model

    await rental.save();
    //increase number on stock of the movie
    await Movie.update({ _id: rental.movie._id}, {
        $inc: {numberInStock: 1}
    });

    res.send(rental);//same as res.status(200).send(rental) because 200 is the default
    
});

//Validates the return
function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(req);
}

module.exports = router;