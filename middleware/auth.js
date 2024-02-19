//Authorization via header verifying
//check if there is a token in the header and verify the token so it is not manipulated.
//Then write the header in req.user so the following middlewares and routhandlers can access it.
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req,res,next) {
    //get the token from the request header
    const token = req.header("x-auth-token");
    //send 401 wrong authorizaton error if no token exists.
    if(!token) { return res.status(401).send("Access denied. No token provided.")}
    try {
        //verify token with private key. Returns decoded header. Throws exeption if invalid token.
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        //the decoded header gets writtern in the request so other middleware can access it.
        req.user = decoded;
        next();
    }catch(ex) {
        //with this response the req res lifecycle gets terminated
        res.status(400).send("Invalid token.");
    }
};