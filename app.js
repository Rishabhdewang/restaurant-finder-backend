const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000; 
const router = require('./routes/route');
const bodyParser = require('body-parser');
const { Model } = require("objection");
const Knex = require("knex");
const knexconfig = require('./knexfile');
const cors = require("cors")

//initialization
const knex = Knex(knexconfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// import routes
app.use("/rest",router)

app.listen(PORT , () => {
    console.log("Listening on port :", +PORT);
})