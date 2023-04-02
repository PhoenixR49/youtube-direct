const express = require("express");
const app = express();
const fs = require("fs");
const ytdl = require("ytdl-core");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const crypto = require("crypto");

app.use("/static", express.static(__dirname + "/public/static/"));
app.use("/sitemap.xml", express.static(__dirname + "/sitemap.xml"));
app.use("/robots.txt", express.static(__dirname + "/robots.txt"));

const pagesPath = __dirname + "/public/html/";
const staticPath = __dirname + "/public/static/";

let lang = "en";
function getUserLang(request) {
    const supportedLanguages = fs.readdirSync("./public/html/");
    const userLangs = request.acceptsLanguages().toString().split(",");

    for (let i = 0; i < userLangs.length; i++) {
        if (userLangs[i].includes(";")) {
            userLangs[i] = userLangs[i].split(";")[0];
        } else if (userLangs[i].includes("-")) {
            userLangs[i] = userLangs[i].split("-")[0];
        }
    }

    addLanguage(userLangs);

    function addLanguage(checkLangs = []) {
        for (let checkLangsCounter = 0; checkLangsCounter < checkLangs.length; checkLangsCounter++) {
            const checkLang = checkLangs[checkLangsCounter];
            for (const supportedLanguage of supportedLanguages) {
                if (checkLang === supportedLanguage) {
                    lang = checkLang;
                    break;
                }
            }
            break;
        }
    }
}

app.get("/", (req, res) => {
    getUserLang(req);
    res.sendFile(pagesPath + lang + "/home.html");
});

io.on("connection", (socket) => {
    const roomId = socket.id;
    socket.join(roomId);
    socket.on("download-video", async (data) => {
        const url = data[0];
        const format = data[1];
        if (ytdl.validateURL(url)) {
            let stream;
            let videoRelativePath;

            let videoTitle;
            await ytdl.getInfo(url).then((data) => {
                videoTitle = data.videoDetails.title.toLocaleLowerCase().split(" ").join("-");
            });

            if (format === "mp4") {
                videoRelativePath = "/videos/" + videoTitle + "-" + crypto.randomBytes(8).toString("hex") + "." + format;
                stream = ytdl(url, {
                    filter: "audioandvideo",
                    quality: "highest",
                });
            } else if (format === "mp3") {
                videoRelativePath = "/audios/" + videoTitle + "-" + crypto.randomBytes(8).toString("hex") + "." + format;
                stream = ytdl(url, {
                    filter: "audioonly",
                    quality: "highest",
                });
            }

            stream.on("finish", () => {
                io.to(roomId).emit("video-downloaded", "/static" + videoRelativePath);
            });

            const videoPath = staticPath + videoRelativePath;
            stream.pipe(fs.createWriteStream(videoPath));
        } else {
            io.to(roomId).emit("wrong-url");
        }
    });
});

http.listen(3000, () => {
    console.log("The server is running !");
});
