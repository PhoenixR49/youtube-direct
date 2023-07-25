const express = require("express");

const router = express.Router();

router.get("/sitemap.xml", (req, res) => {
  res.sendFile(`${__dirname}/sitemap.xml`);
});

router.get("/robots.txt", (req, res) => {
  res.sendFile(`${__dirname}/robots.txt`);
});

module.exports = router;
