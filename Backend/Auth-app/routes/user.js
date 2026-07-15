const express = require("express");
const router = express.Router();

// const user = require("../models/User");

const { login, signup } = require("../controller/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/login", login);
router.post("/signup", signup);

router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "welcome to the protected route for test",

    });
})

//Protected Route
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "welcome to the protected route for students",

    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "welcome to the protected route for admin",

    });
});

// router.get("/getEmail", auth, async (req, res) => {
//     try {
//         const id = req.user.id;
//         const user = await user.findById(id);

//         res.status(200).json({
//             success: true,
//             user: user,
//             message: "welcome to the email route",

//         })


//     }
//     catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message,
//             message: "not success",

//         })

//     }

//     console.log("ID: ", id);
//     res.json({
//         success: true,
//         id: id,
//         message: "welcome to the email route"
//     });
// });

module.exports = router;