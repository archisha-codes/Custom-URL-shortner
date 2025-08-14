const {nanoid} = require("nanoid");
const URL = require('../models/url');
async function handleGenerateNewShortURL(req , ress ){
    const body = req.body;
    if(!body.url) return ress.status(400).json({error: 'url is required'})
    const shortId = nanoid(8) //length passed
    await URL.create({
        shortID: shortId,
        redirectURL: body.url,
        visitHistory: [],

    });
    return res.render('home',{})
    return res.json({ id:shortID})

}

async function handlegetAnalytics(req ,  res){
    const shortId = req.params.shortId;
    const  result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics:result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};