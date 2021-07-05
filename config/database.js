//imports
const mongoose = require("mongoose");
const configuration = require('../configuration/configurations');
require("dotenv").config();


//temp var init
let connectionString = "";
mongoose.Promise = global.Promise;

//connection logic
if (process.env.NODE_ENV === "production") {
  
    connectionString =  configuration.DB_URL ;//|| "mongodb+srv://rajat:nostarac7@cluster0.hpllm.gcp.mongodb.net/" 

  } else if (process.env.NODE_ENV === "test") {

    connectionString = configuration.DB_URL;

  } else {

    connectionString = configuration.DB_URL; //|| "mongodb+srv://rajat:nostarac7@cluster0.hpllm.gcp.mongodb.net/"
}

const connectDB = async () => {
    try {
      await mongoose.connect(connectionString, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        dbName: "DentalHealthcare",
      });
  
      console.log("MongoDB connected...");
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
};

module.exports = connectDB; 