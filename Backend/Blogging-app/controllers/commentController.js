const Post = require("../models/postModel");
const Comment = require("../models/commentsModels");

exports.createComment = async (req, res) => {
    try {
        const { post, user, body } = req.body;
        const comment = new Comment({
            post, user, body
        });

        const savedComment = await comment.save();

        //find post by ID add the new comment to its comments array
        const updatedPost = await Post.findByIdAndUpdate(post, { $push: { comments: savedComment._id } }, { new: true })
            .populate("comments")
            .exec();

        res.json({
            post: updatedPost,
        });
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
};