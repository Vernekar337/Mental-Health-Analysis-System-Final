const mongoose = require("mongoose");

const connectDB = async() =>{
  await mongoose.connect(
    "mongodb+srv://vernekar337:sahil337@cluster0.eqfq30p.mongodb.net/devTinder"
  );
};

module.exports = connectDB;