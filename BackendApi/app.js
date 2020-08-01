const express = require("express");
const mongoose = require("mongoose");
const app = express();


// test db
if (process.env.ENV == 'Test') {
  console.log('This is a test');
  const db = mongoose.connect("mongodb://localhost/bookAPI_Test")
} else {
  // production db
  console.log('This is for real');
  const db = mongoose.connect("mongodb://localhost/bookAPI-prod");
}
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
// import model
const Book = require("./models/bookModel");

// import route from routes folder
// created as function and pass model or schema as argument
const bookRouter = require("./routes/bookRouter")(Book);

// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// use bookrouter
app.use("/api", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to my api!");
});

// start server at port
app.server = app.listen(port, () => {
  console.log("running at port " + port);
});

module.exports = app;