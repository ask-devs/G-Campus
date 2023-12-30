const connectToMySQL = require("./connection"); // mysql connection
const express = require("express"); // for the server
const bodyParser = require("body-parser"); // for parsing and reading json data
const cors = require("cors")

const connection = connectToMySQL(); // connecting the database

const server = express(); // starting the server

server.use(bodyParser.json()); // using the body-parser
server.use(cors()); // using cors to prevent the cors error

const port = 5000;
server.listen(port, () => {
  console.log("server started at localhost " + port);
});

server.get("/test", (req, res) => {
  connection.query("select * from departments", (err, data, fields) => {
    if (err) {
      res.json({ displayMessage: err, data: "", isSuccess: false });
    } else {
      res.json({ displayMessage: "", data: data, isSuccess: true });
    }
  });
});