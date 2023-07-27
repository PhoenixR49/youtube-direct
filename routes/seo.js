const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "../sitemap.xml"));
});

router.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "../robots.txt"));
});

module.exports = router;
