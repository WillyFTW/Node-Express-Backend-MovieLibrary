const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const home = require("../routes/home");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const error = require("../middleware/error");
const logger = require("../middleware/logger");
const helmet = require ("helmet");

//the parameter app gets imported from index.js
module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public')); //images, css files ...
    app.use(helmet());
    app.use(logger);
    //for excample for every request that comes into "/api/genres" we want to use the genres router.
    app.use("/", home);
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/returns", returns);
    app.use(error);
}