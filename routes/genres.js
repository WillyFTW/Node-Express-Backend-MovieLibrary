const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const {Genre, validate} = require("../models/genre");
const router = express.Router();



//GET
//We call asyncMiddleware which returns the same function we pass as parameter but in try catch bracets.
//The returned function then is a parameter of the router and gets called by express.
router.get("/", async (req, res) => {
    //Genre.find().sort("name").then().catch() if you use promisses or try,catch for await. 
    //But we require express-async-errors in index so we dont need a catch.
    //Test:throw new Error("Test error");
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

//POST
//auth is a middleware function that gets called before the actual "post code".
router.post("/", auth, async (req, res) => {
    const validation = validate(req.body);
    if(validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    
    //genre gets saved with an id, which gets saved and returned to client
    const genre = new Genre({name: req.body.name});
    await genre.save();
    res.send(genre);
});

//PUT
router.put('/:id', async (req, res) => {
    //this validation could also be done via the validation middleware. See routes/returns
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    //returns the new updated object instead of the old because of : {new: true}
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});
//DELETE
router.delete('/:id',[auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });

//GET
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

module.exports = router;