const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
//   schema m passportLocalMongoose automatically below field add kr deta h, only field name not value
// that's by here username and password field define ni ki


});

// above schema use krne ke liye
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);