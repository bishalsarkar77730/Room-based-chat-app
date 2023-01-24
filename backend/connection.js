const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://Bishal77730:Bishal77730@cluster0.gkvo84w.mongodb.net/?retryWrites=true&w=majority`,
  () => {
    console.log("connected to mongodb");
  }
);
