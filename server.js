const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const configuration = require('./configuration/configurations');
const  connectDB  = require("./config/database");
var multer  = require('multer');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./GraphQL/rootQuery/rootQuery');
const { Prediction } = require('./routes/prediction');
require('dotenv').config();

//Storage Engine Initialization
var storage = multer.diskStorage({
  destination: function (req, file,  cb) {
    cb(null, './Data/Source_Images/Test_Images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

//server init
const app = express();

//CORS init
var whitelist = configuration.ALLOWEDORIGIN.split(',');
var corsOptionsDelegate = function (req, callback) {
  console.log(req.headers, "from ori")
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { credentials: true, origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

//connect to database
connectDB();

//Init middleware
//app.use(express.json({ extended: false }));
app.use(cookieParser());

//route Init
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.use("/yolo", upload.single("file"), Prediction);

app.use('/graphql', (req,res) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: {req,res}
  })(req,res);
})

module.exports = app;