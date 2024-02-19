//gets called after all routes as part of req, res popeline. So only handles errors that occur in this pipeline.
const winston = require("winston");

module.exports = function(err, req, res, next) {
    // winston importance hirarchy: error, warn, info, verbose, debug, silly
    winston.error(err.message, err);
    //500 internal error.
    res.status(500).send("Something failed.");
};