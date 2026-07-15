const Todo = require("../models/Todo");

//define route handler

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            { _id: id },
            { title, description, updateAt: Date.now() },

        )

        res.status(200).json({
            succes: true,
            data: todo,
            message: `updated data successfully`,

        })




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