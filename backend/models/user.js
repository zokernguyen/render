const mongoose = require('mongoose')
const uniquer = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        require: true,
        unique: true
    },
    name: String,
    passwordHash: {
        type: String,
        require: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
});

userSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
        delete returnedObj.passwordHash
    }
});

userSchema.plugin(uniquer);

const User = new mongoose.model('User', userSchema);

module.exports = User;