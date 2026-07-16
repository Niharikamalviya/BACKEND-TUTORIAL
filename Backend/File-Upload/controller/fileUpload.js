const File = require("../models/File");
const cloudinary = require("cloudinary").v2;


//localfileupload -> handler function


exports.localFileUpload = async (req, res) => {
    try {
        //fetch file
        const file = req.files.file;
        console.log("File fetched", file);

        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH->", path)

        //add path to the move function
        file.mv(path, (err) => {
            console.log(err);
        });

        //create a successfull response
        res.json({
            success: true,
            message: "Local file uploaded successfully",


        });

    }
    catch (error) {
        console.log(error);

    }

}


function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);

}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    console.log("temp filePath", file.tempFilePath);
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
//image upload ka handler

exports.imageUpload = async (req, res) => {
    try {
        //data fetch

        const { name, tags, email } = req.body
        // console.log(req.body);
        console.log(name, tags, email);

        //file fetch
        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file formate not supported",
            })

        }

        //file formate supported hai
        // upload into cloudinary

        const response = await uploadFileToCloudinary(file, "codehelp");
        console.log(response);

        // save entry in DB 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "image successfully uploaded"
        })

    }
    catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            // message: error.message,
            message: "something went wrong",
        });

    }
}

// video upload handler

exports.videoUpload = async (req, res) => {
    try {
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        //validation

        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);


        //file supported or not
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file formate not supported",
            })

        }

        //HW: add a upper limit of 5MB for video upload

        const maxVideoFileSize = 5 * 1024 * 1024;

        if (file.size > maxVideoFileSize) {

            return res.status(400).json({
                success: false,
                message: "video size should be less than 5MB"

            });

        }

        // upload into cloudinary
        console.log("uploaded to cloudinary codehelp folder")
        const response = await uploadFileToCloudinary(file, "codehelp");
        console.log(response);


        // save entry in DB 
        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url,
        });
        res.json({
            success: true,
            videoUrl: response.secure_url,
            message: "video successfully uploaded"
        })



    }
    catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            // message: error.message,
            message: "something went wrong",
        });

    }
}

// imageSizeReducer

exports.imageSizeReducer = async (req, res) => {

    try {
        //data fetch

        const { name, tags, email } = req.body
        // console.log(req.body);
        console.log(name, tags, email);

        //file fetch
        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);


        //quality 
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file formate not supported",
            })

        }

        //file formate supported hai
        // upload into cloudinary

        const response = await uploadFileToCloudinary(file, "codehelp", 100);
        console.log(response);

        // save entry in DB 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "image successfully uploaded"
        })

    }
    catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message,
            // message: "something went wrong",
        });

    }

}
