const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


//createCourse handler function

exports.createCourse = async (req, res) => {
    try {
        //fetch data 
        const { courseName, coourseDescription, whatYouWillLearn, price, tag } = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });

        }

        //chack for instructor

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        console.log("Instructor Details: ", instructorDetails);
        if (!instructorDetails) {
            return res.staatus(404).json({
                success: false,
                message: "Instructor Details not Found",
            });

        }
        //check given tag is valid or not

        const tagDetails = await Tag.finsById(tag);
        if (!tagDetails) {
            return res.staatus(404).json({
                success: false,
                message: "Tags Details not Found",
            });


        }
        //upload Image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,

        })

        //add the new course to the user shcema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );
        //update the tAg ka schema - HW

        //return response
        return res.staatus(200).json({
            success: true,
            message: "course create successfully",
            data: newCourse,
        });



    }



    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.messaage,
        })
    }
};

//getAll Course

exports.showAllCourse = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true, thumbnail: true, instructor: true,
            ratingAndReview: true, studentsEnrolled: true,
        }).populate("Instructor")
            .exec();


        return res.status(200).json({
            success: true,
            message: "data for all course fethced successfully",
            data: allCourses,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "cannot fetch course data",

        })

    }

}
