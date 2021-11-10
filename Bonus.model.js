const mongoose = require ("mongoose");

const Bonus = mongoose.model(
    "Bonus",
    new mongoose.Schema({
        username: String,
        token: "Number",
        money: "Number",
        counterVisitors: [String]
        // email: String,
        // password: String,
        // gameId: "Number",
        // roles: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Role"
        //     }
        // ]
    })
);
module.exports = Bonus;
