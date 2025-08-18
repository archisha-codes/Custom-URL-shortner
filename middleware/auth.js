const {getUser} = require("../services/auth");

async function restrictToLoggedinUserOnly(req, res, next){
    const userUid = req.cookies?.uid;

    if (!userUid) return res.redirect("/Login");
    const user = getUser(userUid)

    if(!user) return res.redirect("/Login");

    req.user = user;
    next();

}
async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = getUser(userUid)

    req.user = user;
    next();

}
module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};