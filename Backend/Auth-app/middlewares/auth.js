// auth isStudent isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //extract JWT token
        //pending : other ways to fetching token 1. body , 2. cookies, 3. header 

        // const token = req.body.token || req.header("Authorization").replace("bearer ", "") || req.cookies.token;
        const token = req.header("Authorization").replace("Bearer ", "");



        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing",

            });

        }
        //varify the token 
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload;

        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid ",

            });
        }
        next();

    }
    catch (error) {

        return res.status(401).json({
            sucess: false,
            message: "something went wrong"
        })
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role != "Student") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for student",

            });
        }

    }
    catch (error) {

        return res.status(500).json({
            sucess: false,
            message: "server error"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role != "Admin") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for Admin",

            });
        }

    }

    catch (error) {

        return res.status(500).json({
            sucess: false,
            message: "server error"
        })
    }
}