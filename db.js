const mongoose = require("mongoose");
const { Schema, models } = require("mongoose");
const { number } = require("zod");
mongoose.connect("mongodb+srv://singh0369aman:Amansingh0369@aman.6sexufp.mongodb.net/Paytm");

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
})

const accountSchema = new Schema({
    name: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    balance: {
        type: Number,
        require: true
    }

})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account
}