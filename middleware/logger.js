//const Joi = require("joi");

function log(req, res, next) {
    console.log("logging...");
    next();
}
module.exports = log; //exports funktion log
//module.exports.logger = log; (or just exports.logger = log;)exports object logger with method log.
//We use module.exports in this example because this is middleware so we want to export a function that can be used as middleware.
//exports = log; funktioniert nicht da "var exports = module.exports" überschrieben wird.
//Da nur module.exports exportiert wird und exports nur eine refernz darauf ist die überschrieben wird.
//Denn exports ist dann nicht mehr model.exports sondern log.