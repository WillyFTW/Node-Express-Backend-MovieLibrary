//wird nicht genutzt da express-async-errors module das selbe macht.
//returns the same function passed as parameter but in try catch bracets to the route handler.
//Catch error if server crashes.
//is not a real middleware because we dont app.use() it. It gets called directly by us. see screenshot.
module.exports = function (handler) {
    return async(req, res, next) => {
        try{
            handler(req, res);
        }catch(err) {
            //Catch error if server crashes. 
            //the next middleware is the error handler middleware.
            next();
        }
    };
}