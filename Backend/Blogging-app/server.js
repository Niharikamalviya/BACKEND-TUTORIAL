
const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const blogRoutes = require("./routes/blog");

app.use("/api/V1", blogRoutes);

app.listen(PORT, () => {
    console.log(`server started successfully at ${PORT}`)
})

const dbConnect = require("./config/database");
dbConnect();


app.get("/", (req, res) => {
    res.send(`<h1>this is blog page</h1>`)
})
