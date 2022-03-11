//imports
const express = require('express');
const cors = require('cors');
const bodyParser = require ('body-parser');
const path = require('path');
const Journal = require('./model/journalModel');
const Comment = require('./model/commentModel');

//create server
const server = express();

//set a port
const port = process.env.PORT || 3000;

//handle our uses
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "client")));
server.use(express.static(path.join(__dirname, "../client")));

//Routing
const siteRoutes = require("./controller/controller.js");
const comments = require('./data/commentData');
server.use('/',siteRoutes);

//start server
server.listen(port, () => console.log(`Server listening on port: ${port}`));

//populate our data
Journal.loadJournals();
Comment.loadComments();

//export server for use
module.exports = server;
