import jwt from "jsonwebtoken";

const authMiddleware = (req, resp, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return resp.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    } catch (error) {
        console.log("JWT Error Name:", error.name);
    console.log("JWT Error Message:", error.message);
        return resp.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
