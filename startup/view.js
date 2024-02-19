module.exports = function(app) {
    //returning html markup with view engine pug which gets required indirectly via app.set
    app.set("view engine", "pug");
    app.set("views", "../views"); //This Line is not necessary because ./views is the default path for view engines.
}