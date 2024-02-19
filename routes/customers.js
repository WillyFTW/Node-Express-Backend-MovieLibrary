const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {Customer, validate} = require("../models/customer");

//GET
router.get("/", async (req, res) => { //"async" is neccessary when await is used in the body
    const customer = await Customer.find().sort("name");
    res.send(customer);
});

//POST
router.post("/", async (req, res) => {
    const validation = validate(req.body);
    if(validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    
    //customer gets saved with an id, which gets saved and returned to client
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
});

//PUT
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold},
        {new: true} //returns the new updated object instead of the old
        );

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});

//DELETE
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });

  //GET
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The genre with the given ID was not found.');
    res.send(customer);
});


module.exports = router;