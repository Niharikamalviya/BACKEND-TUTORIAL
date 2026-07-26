const express = require("express");
const router = express.Router();

const { deleteAccount, updateProfile, getAllUserDetails } = require("../controllers/Profile")
const { auth } = require("../middlewares/auth")

router.delete("/deleteProfile", deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

//get Enrolled COurse

// router.get("/getEnrolledCOurse", auth, getEnrolledCourse)
// router.put("/updateDisplayPicture", auth, updateDisplayPicture)


module.exports = router