const User = require("../models/userModel");
const URL = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");

module.exports.addURL = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ _id: req.session.user.id });
    console.log(user.username);
    // console.log({req.params.userId});

    const { originalUrl } = req.body;
    const baseUrl = process.env.baseURL;

    const urlCode = shortid.generate();

    if (validUrl.isUri(originalUrl)) {
      let url = await URL.findOne({ originalUrl });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new URL({
          originalUrl,
          shortUrl,
          urlCode,
          createdAt: new Date(),
        });

        await url.save();

        user.links.push(url);
        await user.save();

        res.json(url);
      }
    } else {
      res.status(400).json({
        error: "Invalid Url",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

module.exports.redirectURL = async (req, res) => {
  try {
    const url = await URL.findOne({ urlCode: req.params.code });

    if (url) {
      if (Date.now() > url.expiresAt) {
        return res.status(404).send("Short link has expired");
      } else {
        url.clicks += 1;
        url.lastAccessedAt = new Date();
        await url.save();
        return res.redirect(url.originalUrl);
      }
    } else {
      return res.status(404).json({
        error: "No URL Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

module.exports.analyseURL = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ _id: req.session.user.id });

    const userShortLinks = user.links;

    // Fetch details for each short link
    const shortLinksDetails = await Promise.all(
      userShortLinks.map(async (shortLinkId) => {
        const shortLink = await URL.findById(shortLinkId);
        return shortLink;
      })
    );

    res.render("urlAnalysis", { shortLinks: shortLinksDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
