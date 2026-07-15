const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 50
        },
        content: {
            type: String,
            required: true,
            maxLength: 500

        },
        author: {
            type: String,
            required: true,
            maxLength: 50
        },

        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,

        },
        updatedAt: {
            type: Date,
            required: true,
            default: Date.now,

        }
    }
);
module.exports = mongoose.model("Blog", blogSchema);




