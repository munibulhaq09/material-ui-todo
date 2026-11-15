import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

//all tasks
router.get("/", async (req, resp)=>{
    try {
        const todos = await Todo.find({
            userId: req.userId
        });
        resp.status(200).json(todos);
    } catch (error) {
        resp.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

//add new
router.post("/", async (req, resp)=>{
    try {
        const { title, description } = req.body;
        if (!title?.trim() || !description?.trim() ) {
            return resp.status(400).json({
                message: "Title and description are required"
            });
        }

        const todo = await Todo.create({
            title,
            description,
            userId: req.userId
        });

        resp.status(201).json(todo);
    } catch (error) {
        resp.status(500).json({
            message: "Failed to add task"
        });
    }
});

//update
router.put("/:id", async (req, resp)=>{
    try {
        console.log("ID received by backend:", req.params.id);
        const { title, description } = req.body;
        if (!title?.trim() || !description?.trim()) {
            return resp.status(400).json({
                message: "Title and description are required"
            });
        }

        const todo = await Todo.findByIdAndUpdate(
            {
                _id : req.params.id,
                userId : req.userId
            },
            {title, description},
            { returnDocument: "after", runValidators:true }
        );
        if (!todo) {
            return resp.status(404).json({
                message: "Task not found"
            })
        }

        resp.status(200).json(todo);
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        resp.status(status).json({
            message: status === 400
                ? "Invalid task ID"
                : "Failed to update task"
        });
    }
});

//delete
router.delete("/:id", async(req, resp)=>{
    try {
        console.log("DELETE ID received:", req.params.id);
        const todo = await Todo.findByIdAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!todo) {
            return resp.status(404).json({
                message: "Task Not Found"
            });
        }

        resp.status(200).json({
            message: "Task deleted successfully"
        })
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        resp.status(status).json({
            message: status === 400
                ? "Invalid task ID"
                : "Failed to delete task"
        });
    }
});

export default router;