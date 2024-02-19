
/**
 * This module is for creating the schema and the validation
 */
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");


//defining userSchema
const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean
    //in a bigger application you would do sth like 
    //roles:[] or 
    //allowedOperations[] 
    //and pass these as authorization in the header which we can check in the middleware before the routhandler.
});

//add a function to the Object methods inside of userSchema.
//Every Document constructed from Models compiled from this schema have this method.
//(cant use "=>" because it returns this of the caller and not the Object tself)
userSchema.methods.generateAuthToken = function() {
    //create the token with the environment variable of the private Key and the payload.
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
    return token;
}
//User is a mongoose Model and javascript class
const User = mongoose.model("User", userSchema);

//Validates the user
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;

//module.exports.validate = validateUser; (or just exports.validate = validateUser;)exports method validateUser
//exports = validateUser; funktioniert nicht da "var exports = module.exports" überschrieben wird.
//Da nur module.exports exportiert wird und exports nur eine refernz darauf ist die überschrieben wird.
//Denn exports ist dann nicht mehr model.exports sondern validateUser.
//You if you only export one function you can write module.exports = function(){}