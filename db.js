const db = require("./models");

db.mongoose
    .connect(`mongodb+srv://mongo:mongo@ppbet.iwaaz.mongodb.net/myFirstDatabase`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });