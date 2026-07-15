

const mongoose = require("mongoose");

require("dotenv").config();  // jo bhi envirnment me define kiya hoga sara load ho jayega process object ke under.

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL   //dotenv install and use to store inside the process 

    )
        .then(() => console.log("DB is Connected"))
        .catch((error) => {
            console.log(error);
            process.exit(1);
        });
}
module.exports = dbConnect;