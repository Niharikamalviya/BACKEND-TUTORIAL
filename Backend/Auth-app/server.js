const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const dbConnect = require("./config/database");
dbConnect();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

const user = require("./routes/user");
app.use("/api/V1", user);

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);

})

