const User = require("../models/User");

const jobseekerOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (user.role !== "jobseeker") {
            return res.status(403).json({ msg: "Access denied. Job seekers only." });
        }
        next();

    } catch (error) {
        return res.status(500).json({ msg: "Server error" });
    }
};

module.exports = jobseekerOnly;