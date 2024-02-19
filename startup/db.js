const winston = require("winston");
const config = require("config");
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);//get rid of warnings. Needed to add this becausse of an error.
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

module.exports = function() {
    //In production evironment the connection string to a server can be changed via Configs
    const db = config.get("db");
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
        //.catch(() => console.log("Could not connect to ${db}..."));
        //catch is not necessary in the current implementation because we catch all uncaught promises with winston.
}