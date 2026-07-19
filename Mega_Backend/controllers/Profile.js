const Profile = require("../models/Profile");
const User = require("../models/user");


//update profile
exports.updateProfile = async (req, res) => {
    try {
        //get data
        const { dateOfBirth = "", about = "", contactNumber = "", gender = "" } = req.body;

        //get userId
        const id = req.user.id;
        //validation
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();
        //return response 
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profileDetails,
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while ,updating Profile",
            error: error.message,

        });

    }
};

//delete Account

exports.deleteAccount = async (req, res) => {
    try {
        // get Id
        const id = req.user.id;

        // validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // TODO : unenroll user form all enrolled courses 
        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        //delete user

        await User.findByIdAndDelete({ _id: id });

        //job scheduling cronjob 

        // return response
        return res.status(200).json({
            success: true,
            message: "User Account deleted Successfully",

        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "somthing went wrong, while deleting User Account ",
            error: error.message,
        });

    }
}

// get user details

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.body;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response 
        return res.status(200).json({
            success: true,
            message: "get data successfully ",
            error: error.message,
        });

    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "get data not successfully ",
            error: error.message,
        });
    }
}

