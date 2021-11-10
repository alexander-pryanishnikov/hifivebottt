const mongoose = require ("mongoose");

const History = mongoose.model(
    "History",
    new mongoose.Schema({
        status: String,
        date: String,
        check: Number,
        username: String,
        order: [String]
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
module.exports = History;
