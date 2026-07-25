const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/course");

//create Rating

exports.createRating = async (req, res) => {
    try {

        // get user id
        const { userId } = req.user.id;
        // fetch data from req body
        const { rating, review, courseId } = req.body;

        // check user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: { $eleMatch: { $eq: userId } },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled",
            });
        }
        // check if user alredy review the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        })

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "course is already reviewed by the user",
            });
        }
        // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        });
        // update course with the rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReview: ratingReview._id,
                }
            },
            { new: true });
        console.log(updatedCourseDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            ratingReview,
        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating rating and review",

        });

    }
}

//get Average rating

expoorts.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        // calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },

                }
            }
        ])
        // return response
        if (result.rating > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // if noo rating and review exist
        return res.status(200).json({
            success: true,
            message: "Average rating is Zero , no rating given till now."
        })


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while geting rating and review",

        });

    }
}



// getAllRatingAndReview 

exports.getAllRatingAndReview = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",

            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Get All rating and review ",
            data: allReviews,
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while geting rating and review",

        });

    }
}