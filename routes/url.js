const express = require("express");
const { nanoid } = require("nanoid");
const URL = require("../models/url");

const router = express.Router();

const nameToUrlMap = {
  linkedin: "https://www.linkedin.com",
  github: "https://github.com",
  google: "https://www.google.com"
};

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    let finalURL = body.redirectURL || body.url;
    
    if (!finalURL && body.name) {
      const mapped = nameToUrlMap[body.name.toLowerCase()];
      if (mapped) finalURL = mapped;
    }

    if (!finalURL) {
      if (req.accepts('html')) {
        return res.render("home", { 
          title: "URL Shortener",
          message: "URL is required",
          messageType: "error"
        });
      }
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(8);

    await URL.create({
      shortId,
      redirectURL: finalURL,
      visitHistory: []
    });

    if (req.accepts('html')) {
      const allUrls = await URL.find({});
      return res.render("home", { 
        title: "URL Shortener",
        id: shortId,
        urls: allUrls,
        message: "URL shortened successfully!",
        messageType: "success"
      });
    }

    res.json({ id: shortId, redirectURL: finalURL });
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { title: "Server Error" });
  }
});

router.get("/analytics/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      if (req.accepts('html')) {
        return res.render("404", { title: "Not Found" });
      }
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      totalClicks: entry.visitHistory.length,
      analytics: entry.visitHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { title: "Server Error" });
  }
});

module.exports = router;