const express = require("express");
const { nanoid } = require("nanoid");
const URL = require("../models/url");

const router = express.Router();

// Optional mapping for short names
const nameToUrlMap = {
  linkedin: "https://www.linkedin.com/in/archisha-ranjan-945315287/",
  github: "https://github.com/",
  google: "https://www.google.com/"
};

// POST /url
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Accept redirectURL, url, or name
    let finalURL = body.redirectURL || body.url;
    if (!finalURL && body.name) {
      const mapped = nameToUrlMap[body.name.toLowerCase()];
      if (mapped) finalURL = mapped;
    }

    if (!finalURL) {
      return res.status(400).json({ error: "redirectURL is required" });
    }

    const newUrl = await URL.create({
      shortId: nanoid(8), // generate unique short id
      redirectURL: finalURL,
      visitHistory: []
    });

    res.json({ id: newUrl.shortId, redirectURL: newUrl.redirectURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /analytics/:shortId
async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      totalClicks: entry.visitHistory.length,
      analytics: entry.visitHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
