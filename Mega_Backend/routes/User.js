const express = require("express");
const router = express.Router();

const { login, signUp, sendOTP, changePassword } = require("../controllers/Auth")
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth")

router.post("/login", login)
router.post("/signup", signUp)
router.post("/sendotp", sendOTP)
router.post("/changePassword", auth, changePassword)
router.post("/resetPassword ", resetPassword)

module.exports = router