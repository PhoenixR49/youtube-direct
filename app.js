const express = require("express");
const path = require("path");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("morgan");
const compression = require("compression");
const i18nextMiddleware = require("i18next-http-middleware");
const i18nextConfig = require("./config/i18n");

const app = express();
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const indexRouter = require("./routes/index");
const aboutRouter = require("./routes/about");
const seoRouter = require("./routes/seo");

app.use(i18nextMiddleware.handle(i18nextConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet.xssFilter());
app.use(helmet.ieNoOpen());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
  "/static/libs/bootstrap",
  express.static(`${__dirname}/node_modules/bootstrap/dist`)
);

app.use("/", indexRouter);
app.use("/", aboutRouter);
app.use("/", seoRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((req, res) => {
  // set locals, only providing error in development
  res.locals.message = res.errored.message;
  res.locals.error = req.app.get("env") === "development" ? res.errored : {};

  // render the error page
  res.status(res.statusCode || 500);
  res.render("error");
});

module.exports = app;
