module.exports = function(req, res, next) {
    //req.user.isAdmin was set by the middleware auth before. Auth extracted "isAdmin" from the header and wrote it into the request.
    if(!req.user.isAdmin) { return res.status(403).send("Access denied.")}
    next();
}