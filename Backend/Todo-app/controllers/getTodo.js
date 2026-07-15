const Todo = require("../models/Todo");


exports.getTodo = async (req, res) => {
    try {
        //fetch all todo from database
        const todos = await Todo.find({});

        //response
        res.status(200).json({
            succes: true,
            data: todos,
            message: "Entire Todo Data is fetched",

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
}

//get by single id

exports.getTodoById = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById({ _id: id })
        //data forgiven id not found

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "No Data Found"
            })
        }

        //response
        res.status(200).json({
            succes: true,
            data: todo,
            message: `Todo ${id} data successfully found`,

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