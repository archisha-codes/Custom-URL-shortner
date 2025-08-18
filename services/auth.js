const jwt = require("jsonwebtoken");

// Secret key (keep this in .env file in real projects)
const secret = "archi$123@$";

// Create JWT for a user
function setUser(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        secret,
        { expiresIn: "1h" } // Token expires in 1 hour
    );
}

// Verify JWT and get user data back
function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; // invalid/expired token
    }
}

module.exports = {
    setUser,
    getUser,
};
