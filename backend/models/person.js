const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to: ", url);

mongoose.connect(url)
    .then(result => console.log("connected to MongoDB"))
    .catch(err => console.log('error connecting to MongoDB: ', err.message));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (number) {
                return /^\d{2,3}-\d+$/.test(number);
            }
        }
    }
});

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id
        delete returnedObj.__v
    }
});

module.exports = mongoose.model('Person', personSchema);