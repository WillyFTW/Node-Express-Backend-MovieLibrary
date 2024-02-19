//Authentication of user (password, email login).
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const {User} = require("../models/user");
const router = express.Router();

//POST
router.post("/", async (req, res) => { //"async" is neccessary when await is used in the body
    //Joi validation
    const {error} = validate(req.body);
    if(error) {return res.status(400).send(error.details[0].message)}
    //check if a user with that email exists.
    let user = await User.findOne({email: req.body.email});
    if(!user) {
        //here we use error 400 instesd of 404 because we dont want to share if an email or password was not found. Instead we return a bad request.
        return(res.status(400).send("Invalid email or password."));
    }else {
        //check if the given password is the equivalent to the hashed and salted password in the db.
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {return(res.status(400).send("Invalid email or password."))}
        //create the token with the environment variable of the private Key and the payload
        
        const token = user.generateAuthToken();
        //sending the token in the header of the response. Custom defined headers always should start with "-x" as naming convention
        res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
    };
});

//Validates the req
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;