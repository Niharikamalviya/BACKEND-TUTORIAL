// step 1 : create folder
// step 2 : npm init -y
// step 3 : npm i express
// step 4 : create server.js (server creation)

const express = require('express');   //Server instantiate :- ka matlab hota hai server ka object create karna, yani server ko memory me banana taaki wo requests ko listen kar sake.
const app = express();


//use to parse req.body in case of post and put 
const bodyParser = require('body-parser')
app.use(bodyParser.json());


app.listen(3000, () => {   //callback function ko call kiya hai using () this and 3000 port pr set kiya hai 
    console.log("server started at port 3000");
});

app.get('/', (req, res) => {
    res.send("hello jee,namaskaar ");
})

app.post('/api/cars', (req, res) => {
    const { name, brand } = req.body;
    console.log(name);
    console.log(brand);
    res.send("car submit successfully")


})

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cars')

    .then(() => {
        console.log("connection successfully")

    })
    .catch((error) => {
        console.log(error)

    });