const express = require("express");

const router = express.Router();

router.get("/about", (req, res) => {
  res.render("pages/about", {
    page: "about",
    header: {
      downloader: req.t("all.header.downloader"),
      about: req.t("all.header.about"),
    },
    title: req.t("about.title"),
    description: req.t("about.description"),
    texts: {
      about: req.t("about.texts.about")
    }
  });
});

module.exports = router;
