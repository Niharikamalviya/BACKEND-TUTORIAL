const Blog = require("../models/blogs");

exports.createBlog = async (req, res) => {

    try {
        const { title, content, author, tags, views, likes, comments } = req.body;

        const response = await Blog.create({ title, content, author, tags, views, likes, comments });

        res.status(200).json(
            {
                success: true,
                data: response,
                message: "entry created successfully"

            }
        );


    }

    catch (err) {
        console.error(err);
        console.log(err);
        res.status(500)
            .json({
                success: false,
                data: "intrnal server error",
                message: err.message,
            })

    }
}