const Subsection = require("../models/SubSection");
const section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create SubSection
exports.createSubSection = async (req, res) => {
    try {
        //fetch data fron body
        const { sectionId, title, timeDuration, description } = req.body;

        //extract video
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "misssing fields",
            });
        }
        //upload video cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create a sub-section
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update section with this sub section ID
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId }, { $push: { subSection: subSectionDetails._id, } }, { new: true });

        //HW log updated section here, after adding populate query
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-Section created successfully",
            updatedSection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating sub-Sectiony",
        });

    }
}

//HW update sub section
exports.updateSubSection = async (req, res) => {
    try {
        //get id
        const { subSectionId, sectionId } = req.body;
        //validated
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found",
            })


        }
        //update on ID
        const updatedDetails = await section.findByIDAndUpdate({ title, description, timeDuration, videoUrl, additionalUrl })
        // what to update
        //return response

        return
    }
    catch (error) {

    }
}

//HW delate SUB section