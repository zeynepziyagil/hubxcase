const mongoose = require('mongoose');

// define the book schema
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        ISBN: {
            type: Number,
            required: true
        },
        
        language: {
            type: String,
            required: true
        },
        numberofpages: {
            type: String,
            required: true
        },
        publisher: {
            type: String,
            required: true
        }
    });
// create the book model using the author schema
const Book = mongoose.model('Book', bookSchema);
// export the book model to be used in other files
    module.exports = Book;