const express = require("express");
const app = express();
const fs = require("fs");
const ytdl = require("ytdl-core");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const crypto = require("crypto");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
require("dotenv").config();

app.use("/static", express.static(__dirname + "/public/static/"));
app.use("/static/libs/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"))
app.use("/robots.txt", express.static(__dirname + "/robots.txt"));

const appStartDate = new Date();
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

app.get("/about", (req, res) => {
    getUserLang(req);
    res.sendFile(pagesPath + lang + "/about.html");
});

app.get("/sitemap.xml", function (req, res) {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    try {
        const smStream = new SitemapStream({ hostname: "https://" + process.env.APP_DOMAIN + "/" });
        const pipeline = smStream.pipe(createGzip());

        smStream.write({ url: "/", changefreq: "weekly", lastmod: appStartDate, priority: 1 });
        smStream.write({ url: "/about", changefreq: "monthly", lastmod: appStartDate, priority: 0.8 });

        smStream.end();
        pipeline.pipe(res).on("error", (e) => {
            throw e;
        });
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.all("*", (request, response) => {
    response.redirect("/");
});

io.on("connection", (socket) => {
    const roomId = socket.id;
    socket.join(roomId);
    socket.on("download-video", async (data) => {
        const video = data[0];
        const format = data[1];
        if (ytdl.validateURL(video)) {
            let stream;
            let videoRelativePath;

            let videoTitle;
            await ytdl.getInfo(video).then((data) => {
                videoTitle = data.videoDetails.title.toLocaleLowerCase().split(" ").join("-");
            });

            if (format === "mp4") {
                videoRelativePath = "/videos/" + videoTitle + "-" + crypto.randomBytes(8).toString("hex") + "." + format;
                stream = ytdl(video, {
                    filter: "audioandvideo",
                    quality: "highest",
                });
            } else if (format === "mp3") {
                videoRelativePath = "/audios/" + videoTitle + "-" + crypto.randomBytes(8).toString("hex") + "." + format;
                stream = ytdl(video, {
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
            axios({
                method: "GET",
                url: "https://youtube.googleapis.com/youtube/v3/search?q=" + video + "&part=snippet&maxResults=25&order=relevance&type=video&key=" + process.env.YOUTUBE_API_KEY,
            })
                .then((data) => {
                    data = data.data.items;
                    const resultsData = [];
                    for (let i = 0; i < data.length; i++) {
                        const video = data[i];
                        const videoData = {
                            url: "https://youtu.be/" + video.id.videoId,
                            thumbnail: video.snippet.thumbnails.medium.url,
                            author: video.snippet.channelTitle,
                            title: video.snippet.title,
                            description: video.snippet.description,
                        };
                        resultsData.push(videoData);
                    }
                    io.to(roomId).emit("search-results", resultsData);
                })
                .catch((error) => {
                    console.error(error);
                    io.to(roomId).emit("error", error.code);
                });
        }
    });
    socket.on("videoInput-value", (value) => {
        if (ytdl.validateURL(value)) {
            socket.emit("videoInput-type", "default");
        } else {
            socket.emit("videoInput-type", "search");
        }
    });
});

http.listen(3000, () => {
    console.log("The server is running !");
    setInterval(() => {
        const lunchingTime = Date.now() - appStartDate.getTime();
        console.log(`Application lancée depuis : ${(lunchingTime / 3600000).toFixed()} heures`)
    }, 3600000);
});
