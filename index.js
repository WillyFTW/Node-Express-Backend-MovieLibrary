const express = require("express");
var winston = require("winston");

const app = express();
//the required function gets returned and executed.
require("./startup/logging")(); //logging is the first line so it can log following errors.
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")(app);
require("./startup/validation")();
require("./startup/view")(app);
require("./startup/prod")(app);

// listening on a Port
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
