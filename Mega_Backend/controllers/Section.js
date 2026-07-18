const Section = require("../medels/section");
const Course = rewuire("../models/Course");

exports.createSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, courseId } = req.body;
        //validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",

            });
        }
        //create section
        const newSection = await Section.create({ sectionName });

        //update course with section objectid
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            { $push: { courseContent: newSection._id } }, { new: true },

        )
        //TODO HM section and subcetion populate both
        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,

        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating  Section"

        });

    }
}


//update section


exports.updateSection = async (req, res) => {
    try {
        // fetch data
        const { sectionName, sectionId } = rew.body;

        //validate

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",

            });
        }
        //update data 

        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        //retrn response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",


        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating  Section"

        });

    }
}


//delete section

exports.deleteSection = async (req, res) => {
    try {
        //getID
        const { sectionId } = req.params

        //find ID and delete
        await Section.findByIdAndDelete(sectionId);
        // TODO : do we need to delete the entry from schema ??
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting  Section"

        });

    }
}