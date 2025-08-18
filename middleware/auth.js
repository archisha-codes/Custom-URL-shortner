const { getUser } = require("../services/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const token = req.cookies?.uid; // ✅ must match cookie name

    if (!token) {
        return res.redirect("/login"); // not logged in
    }

    const user = getUser(token);

    if (!user) {
        return res.redirect("/login"); // invalid/expired token
    }

    req.user = user; // store user info in request
    next();
}

async function checkAuth(req, res, next) {
    const token = req.cookies?.uid;

    const user = getUser(token);
    req.user = user; // will be null if not logged in

    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};
