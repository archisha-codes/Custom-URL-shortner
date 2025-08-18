const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require('./connect');
const {restrictToLoggedinUserOnly, checkAuth} = require("./middleware/auth");
const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Middleware to add host to all responses
app.use((req, res, next) => {
  res.locals.host = `${req.protocol}://${req.get('host')}`;
  next();
});

app.use("/url",restrictToLoggedinUserOnly, urlRoute);     //inline middleware
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.get("/test", async (req, res) => {
  try {
    const allUrls = await URL.find({});
    return res.render("home", {
      urls: allUrls,
      title: "Test Page"
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { title: "Server Error" });
  }
});

app.get("/:shortId", async (req, res) => {
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).render("404", { title: "Not Found" });
    }
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { title: "Server Error" });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error" });
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));