const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "mysecretkey123"
        );
        req.user = decoded.user;
        next();

    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = auth;