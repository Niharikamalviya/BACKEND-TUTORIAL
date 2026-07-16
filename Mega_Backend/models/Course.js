const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    courseDesciption: {
        type: String,
        trim: true,
        required: true,

    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseContent",
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: Number,
    },
    thumnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",

    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    }]


});

module.exports = mongoose.model("course", courseSchema);
