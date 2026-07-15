
const express = require("express");  //server inst.
const app = express();


// load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware to parse json request body

app.use(express.json());

//import routes for todo API hello

const todoRoutes = require("./routes/todos");


app.use("/api/V1", todoRoutes);

//start server

app.listen(PORT, () => {
    console.log(`server started successfully at ${PORT}`)
})

//connect to the database

const dbConnect = require("./config/database");
dbConnect();


//default route
app.get("/", (req, res) => {
    res.send(`<h1>this is home page</h1>`)
})

