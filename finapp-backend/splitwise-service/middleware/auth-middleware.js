const { verifyToken } = require("../utils/jwt-util");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            sucess: false,
            message: " Authorization token is missing."
        });
    }

    const token = authHeader.substring(7);

    try {

        const decoded = verifyToken(token);
console.log(decoded);
        req.user = {
            email: decoded.sub,
            userId: decoded.userId,
            role: decoded.role
        };

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
    next();
}

module.exports = authenticate;