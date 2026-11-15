import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();




// register
router.post("/register", async (req, resp) => {
    try {
        console.log("REGISTER ROUTE CALLED");
console.log("Registration email:", req.body.email);
        const { name, email, password } = req.body;

        //check empty
        if (!name?.trim() || !email?.trim() || !password) {
            return resp.status(400).json({
                message: "All fields are required"
            });
        }

        //email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return resp.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        //pass length
        if (password.length < 8) {
            return resp.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        //exist user
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });
        if (existingUser) {
            return resp.status(409).json({
                message: "Email is already registered"
            });
        }

        //hash pass
        const hashPass = await bcrypt.hash(password, 10);

        //verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        //hash verificationtoken
        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // create user
        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashPass,
            verificationToken: hashedToken,
            verificationTokenExpires: Date.now() + 15 * 60 * 1000
        });

        //verification link
        const verificationLink =
            `${process.env.API_URL}/api/auth/verify-email?token=${verificationToken}`;
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // send verification email
        await transporter.sendMail({
            from: `"TodoApp" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your TodoApp account",
            html:
                `<h2>Welcome to TodoApp!</h2>
                <p>Please click the link below to verify your email:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link expires in 15 minutes.</p>`
        });

        resp.status(201).json({
            message: "Registration successful! Please check your email to verify your account."
        });

    } catch (error) {
        console.error("Registeration error:", error);

        resp.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
});

// Email verification 
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;

        // Check token exists
        if (!token) {
            return res.status(400).send("Verification token is missing.");
        }

        // Hash token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user
        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send(
                "Invalid or expired verification link."
            );
        }

        // Verify user 
        user.isVerified = true;

        // Remove verification token
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.status(200).send(
            "Email verified successfully! You can now sign in to TodoApp."
        );

    } catch (error) {
        console.error("Email verification error:", error);

        res.status(500).send("Email verification failed.");
    }
});

//login
router.post("/login", async (req, resp)=>{
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            return resp.status(400).json({
                message: "Email and password are required"
            });
        }
        //check user
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });
        if (!user) {
            return resp.status(401).json({
                message: "Invalid email or password"
            });
        }
        //check pass
        const checkPass = await bcrypt.compare(
            password, user.password
        );
        if (!checkPass) {
            return resp.status(401).json({
                message: "Invalid email or password"
            });
        }
        //check verification
        if (!user.isVerified) {
            return resp.status(403).json({
                message: "Please verify your email before logging in"
            });
        }

        //generate token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        resp.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        resp.status(500).json({
            message: "Login failed. Please try again."
        });
    }
});


export default router;