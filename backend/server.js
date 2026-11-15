import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/api/auth", authRoutes);


app.get("/", (req, resp)=>{
    resp.json({
        message: "Material UI Todo API is running"
    });
});

app.use("/api/todos", todoRoutes);

const PORT = process.env.port || 5001;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDB connected successfully");
    
    app.listen(PORT, ()=>{
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
.catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });