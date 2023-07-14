const mongoose = require('mongoose');

// define the author schema
const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        birthdate: {
            type: Number,
            required: true
        },
       
    });
// create the Author model using the author schema
    const Author = mongoose.model('Author', authorSchema);

// export the Author model to be used in other files
    module.exports = Author;