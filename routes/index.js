const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/index", {
    header: {
      downloader: req.t("all.header.downloader"),
      about: req.t("all.header.about"),
    },
    forms: {
      downloader: {
        feedbacks: {
          invalids: {
            searchTerms: req.t(
              "home.forms.downloader.feedbacks.invalids.searchTerms"
            ),
          },
        },
        inputs: {
          format: {
            first: req.t("home.forms.downloader.inputs.format.first"),
            second: req.t("home.forms.downloader.inputs.format.second"),
            third: req.t("home.forms.downloader.inputs.format.third"),
          },
          searchTerms: req.t("home.forms.downloader.inputs.searchTerms"),
        },
      },
    },
    title: req.t("home.title"),
    description: req.t("home.description"),
  })
});

module.exports = router;
