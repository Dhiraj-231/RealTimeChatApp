import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) return res.status(401)
        .json(
            {
                sucess: false,
                message: "Unauthorized access , Please login"
            });
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decode?._id;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json("Token has expired.");
            return;
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json("Invalid token.");
            return;
        } else {
            res.status(401).json("Token verification failed:", err.message);
        }
    }

    next();
}