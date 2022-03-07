//imports
const express = require('express');
const cors = require('cors');
const bodyParser = require ('body-parser');
const path = require('path');

//create server
const server = express();

//set a port
const port = 3000;

//handle our uses
server.use(cors());
server.use(express.static(path.join(__dirname, "client")));
server.use(express.static(path.join(__dirname, "../client")));

//Routing
const siteRoutes = require("./controller/controller.js");
server.use('/',siteRoutes);

//start server
server.listen(port, () => console.log(`Server listening on port: ${port}`));


