const jwt = require("jsonwebtoken");

const verifyToken = function (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { verifyToken };