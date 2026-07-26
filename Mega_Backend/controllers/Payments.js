const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
// const { conrseEnrollmentEmail } = require("../mails/templates/courseEnrollemntEmail");


//capture the payment 


exports.capturePayment = async (req, res) => {
    try {
        //get courseId and userId
        const { course_id } = req.body;
        const userId = req.user.id;

        //validation
        //valid courseId
        if (!course_id) {
            return res.json({
                success: false,
                message: "Please enter valid courseId"
            })
        };

        //valid courseDetails
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            //user already pay for the same course 

            const uid = new mongoose.types.ObjectId(userId);
            if (course.studentEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "Student is already Enrolled",
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }


        // order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.Now()).toString(),
            notes: {
                courseId: course_id,
                userId,

            }
        };

        try {
            // initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
        }

        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "could not initiate order",
            });

        }
        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumnail: paymentResponse.thumnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentRespoonse.amount
        });

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// capture & authorized thee payment

exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = "12345678";
        const signature = req.headers("x-razorpay-signature");

        //Hmac : - hashed based message authentication code
        //SHA :- secure hashing algorithm

        //step :- (A)
        const shasum = crypto.createHmac("sha256", webhookSecret);
        //step :- (B)
        shasum.update(JSON.stringfy(req.boody));
        //step :- (C)
        const digest = shasum.digest("hex");

        //match signature and digest
        if (signature === digest) {
            console.log("Payment is Authorised");

            const { courseId, userId } = req.body.payload.payment.entity.notes;

            try {
                //fulfill the action


                //find the course ad Enrolled the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    { $push: { studentEnrolled: userId } },
                    { new: true },
                );

                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        message: "Course not found",
                    });

                }
                console.log(enrolledCourse);
                //find the student and add the course list of enrolled COurse
                const enrolledStudent = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { courses: courseId } },
                    { new: true },
                );
                console.log(enrolledStudent);

                //mail send karna coonfirmation
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations from codehelp",
                    "congratulaations You are onboarded into new codehelp Course",

                );
                console.log(emailResponse);
                return res.status(200).json({
                    success: true,
                    message: "Signature verified and Courses Added successfully",
                })
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });

            }
        }

        else {
            return res.status(400).json({
                success: false,
                message: "Invalid request",

            })
        }
    }


    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
