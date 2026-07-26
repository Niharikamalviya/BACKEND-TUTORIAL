const express = require("express");
const router = express.Router();

const { createCourse, showAllCourse, getCourseDetails } = require("../controllers/Course")

router.post("/createCourse", createCourse);
router.post("/showAllCourses", showAllCourse);
router.get("getCoursesDetails", getCourseDetails);

module.exports = router