const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

//signUp route handler

exports.signup = async (req, res) => {
    try {
        //get data

        const { name, email, password, role } = req.body
        //check if user alredy exist to call DD by usinf findOne function 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already Exists",

            });

        }
        //secure password
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10);

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "error in hashing password",

            });

        }

        //create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role

        })

        res.status(200).json({
            success: true,
            message: "user create Successfully ",
        });




    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "user cannot be registered, please try again later"

        })


    }
}

//login

exports.login = async (req, res) => {
    try {
        //data fetch 
        const { email, password } = req.body;
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all the details carefully",
            });
        }

        //check for registter user

        let user = await User.findOne({ email });
        //if not a register user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }

        //verify password & generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "2h",

                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,

            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user Logged in successfully"


            });

        }
        else {
            return res.status(403).json({
                success: false,
                message: "password Incorrect",


            })
        }





    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure",

        })

    }
}