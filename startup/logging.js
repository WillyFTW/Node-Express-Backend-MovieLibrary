//show all debug messages by setting environment variable DEBUG=app:* or DEBUG=app:debug,app:Test
//shows no debug messages if no environment variable is set.
const debug = require("debug")("app:debug");
var winston = require("winston");
require("winston-mongodb");
require("express-async-errors");//look middleware/async

module.exports = function() {

//on event of uncaughtExeption(anywhere in code) the ex gets logged and the programm get terminated.
//But only works with Uncaought Exceptions at this time not unhandled Rejections!


winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({filename: "uncaughtExceptions.log"}));

//on event of unhandled Rejection(anywhere in code) we throw ex so winston.handleExceptions() logs it.
//winston.handledRejections() doesnt exist at this time. Maybe in the future.
//For asyncronous code (promises not catched, await without try catch).
process.on("unhandledRejection", (ex)=> {
    throw(ex);
});

/** Alternative to winston.handleExceptions().
 * on event of uncaughtExeption(anywhere in code) the ex gets logged and the programm only get terminated if we manually teminate it.
 * BUT only works with synchronous code!
process.on("uncaughtException", (ex)=> {
    winston.error(ex.message, ex);
    process.exit(1);
}); //Best Practice to end programm now. Because Procrss is in an unclean state. In Production we use Process Managers to restart.
*/


//telling winston to make a logfile where all winston errors get saved.
winston.add(winston.transports.File, {filename: "logfile.log"});
//telling winston to store logs in the given mongodb data bank. 
//Only messages with the same or higher priority than level getting logged. See middleware error.js.
winston.add(winston.transports.MongoDB, 
    {db: "mongodb://localhost/vidly",
    level: "info"}
);

//testing if debug import is working. Shows no debug messages if no environment variable is set.
debug("debug funktioniert");

}
