const express = require("express");
const router = express.Router();

//GET
router.get("/", (req, res) => {
    res.render("index", {title: "My Express App", message: "Welcome!" });
});

module.exports = router; //wieso wird router exported?
//Weil man kann es importieren mit: const home = require("./routes/home");