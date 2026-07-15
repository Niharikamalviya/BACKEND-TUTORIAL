const express = require("express");
const router = express.Router();

const { imageUpload, localFileUpload, videoUpload } = require("../controller/fileUpload");


router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);

module.exports = router;

