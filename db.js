const mongoose = require('mongoose');

const connectDB = async () => {
    try {       // establish a connection to the MongoDB database
        await mongoose.connect("mongodb://root:pass@db:27017", 
        {useNewUrlParser: true, 
        useUnifiedTopology: true,

    });
    console.log("MongoDB Connected")
    }
    catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    } 
}
// connectDB function to make it accessible to other modules
module.exports = connectDB;

