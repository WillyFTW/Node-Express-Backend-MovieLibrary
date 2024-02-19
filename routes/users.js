const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const {User, validate} = require("../models/user");
const router = express.Router();

//GET
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

//POST register a new user
router.post("/", async (req, res) => { //"async" is neccessary when await is used in the body
    //Joi validation
    const validation = validate(req.body);
    if(validation.error) {return res.status(400).send(validation.error.details[0].message)};
    //check if a user with that email already exists.
    let user = await User.findOne({email: req.body.email});
    if(user) {
        //here we use error 400 instesd of 404 because we dont want to share if an email or password was not found. Instead we return a bad request.
        return res.status(400).send("User already registered")
    }else {
        //new user
        user = new User(_.pick(req.body, ["name", "email", "password"]));
        //gnerate Salt to mix with the hashed password and save the user in with hashed password in db
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        //The new user gets authenticated immediately
        const token = user.generateAuthToken();
        //sending the token in the header of the response. Custom defined headers always should start with "-x" as naming convention
        res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
    };
});

module.exports = router;