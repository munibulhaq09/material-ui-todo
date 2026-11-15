import mongoose from "mongoose";

const todoScheme = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Todo = mongoose.model("Todo", todoScheme);

export default Todo;