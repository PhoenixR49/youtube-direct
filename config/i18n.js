const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const backend = require("i18next-fs-backend");
const fs = require("fs");
const path = require("path");

const localesFolder = path.join(__dirname, "../locales");
i18next
  .use(middleware.LanguageDetector)
  .use(backend)
  .init({
    fallbackLng: "en",
    preload: fs.readdirSync(localesFolder).filter((fileName) => {
      const joinedPath = path.join(localesFolder, fileName);
      return fs.lstatSync(joinedPath).isDirectory();
    }),
    backend: {
      loadPath: path.join(localesFolder, "{{lng}}/{{ns}}.json"),
    },
  });

module.exports = i18next;
