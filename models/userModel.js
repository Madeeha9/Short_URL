const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const userSchema = new mongoose.Schema({
    name : {
        type: String, required: true
    },
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    links: [{
        type: ObjectId,
        ref: 'URL'
    }]
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);