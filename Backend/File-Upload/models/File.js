const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    imageUrl: {
        type: String,

    },
    tags: {
        type: String,

    },
    email: {
        type: String,
    },

    videoUrl: {
        type: String,

    },
});


// post middleware
fileSchema.post("save", async function (doc) {
    try {
        console.log("DOC", doc)  //doc means the enrty created in your DB 

        //transporter
        //best practice to write into under config 
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,

            },
        });

        //send mail
        let info = await transporter.sendMail({
            from: `codehelp`,
            to: doc.email,
            subject: "New file uploaded on cloudinary",
            html: `<h2>Hello user </h2> <p>file upload successfully<p> view here <a href= "${doc.imageUrl}">${doc.imageUrl}</a>`
        })
        console.log("INFO", info);

    }
    catch (error) {
        console.error(error);

    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;