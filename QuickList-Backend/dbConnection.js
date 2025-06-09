const mongoose = require("mongoose");
require("dotenv").config();

// Access the environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const connectionUrl = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
mongoose
  .connect(connectionUrl)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`connected to database`);
    }
  })
  .catch((err) => console.log(`connection error: ${err}`));

module.exports = mongoose;
