const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP

exports.sendOTP = async (req, res) => {
    try {
        //fetch email from request ki body
        const { email } = req.body;

        //check user already exist
        const checkUserPresent = await User.findOne({ email });

        //if user already exist, then return response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User alredy register",
            })
        }

        //generate otp 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated:", otp);

        //check unique otp or not 
        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })

            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry for otp
        //create an object

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successful
        res.status(200).json({
            success: true,
            message: 'OTP sent Successfully',
            otp,

        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

};

//signUp 
exports.signUp = async (req, res) => {

    try {

        //data fetch from request ki body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumer, otp

        } = req.body;

        //validate krlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            })
        }



        //2 passwor match
        if (password !== confimPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirmpassword does not match, please try again'
            });
        }



        //check user already exist on not
        const existingUser = await User.finOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            });
        }


        // find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        //-1 means Descending (Newest → Oldest)( 10:10, 10:05,10:00) 
        console.log(recentOtp);

        // validate OTP
        if (recentOtp.length == 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: 'OTP not Found',
            })
        } else if (otp != recnetOtp.otp) {
            //Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }


        //hash password

        const hashedPassword = await bcrypt.hash(password, 10);
        //entry create in Db

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await user.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })


        //return response
        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            user,
        });



    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'User can not be registered,please try again.'
        })

    }

}

//login 

exports.login = async (req, res) => {
    try {
        //fetch data
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //user check exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'user is not found, please sign up first',
            });

        }

        //generate  JWT token , after password match
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;


            // create cookies and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "logged in successfully"
            })

        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }



    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Faliure, please try again",
        });

    }
}

//changePassworrd --> HM

exports.changePassword = async (req, res) => {
    try {
        //get oldpassword, new password, confirmNewpassword
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // # validate

        // 1. check all fields are present or not 
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // 2. match both passwords

        if (newPassword !== confimPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirmpassword does not match, please try again'
            });
        }

        // 3. fetch user from DB

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user does not Found",
            });
        }

        // 4. Old password and newPassword same nhi hona chaiye 

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the old password",
            });
        }

        // 5. Old password verify to DB

        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        // update password in DB

        const user = await User.crete({
            newPassword: hashedPassword,
        })


        // send mail- password updated
        await mailSender(email, "Password Changed Successfully");

        //return response
        return res.status(200).json({
            success: true,
            message: 'Password changed Successfully',
            user,
        });



    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'something went wrong while changing password,please try again.'
        })

    }

}