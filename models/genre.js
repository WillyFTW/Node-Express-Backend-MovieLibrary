
/**
 * This module is for creating the schema and the validation
 */
const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

//Genre is a mongoose Model and javascript class
const Genre = mongoose.model("Genre", genreSchema);

//Validates the genre
function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;