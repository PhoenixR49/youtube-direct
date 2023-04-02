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

app.get("/", (req, res) => {
    res.sendFile(pagesPath + "/home.html");
});

io.on("connection", (socket) => {
    socket.on("download-video", async (data) => {
        const url = data[0];
        const format = data[1];
        if (ytdl.validateURL(url)) {
            let stream;
            if (format === "mp4") {
                stream = ytdl(url, {
                    filter: "audioandvideo",
                    quality: "highest",
                });
            } else if (format === "mp3") {
                stream = ytdl(url, {
                    filter: "audioonly",
                    quality: "highest",
                });
            }

            let videoTitle;
            await ytdl.getInfo(url).then((data) => {
                videoTitle = data.videoDetails.title;
            });

            const videoRelativePath = "videos/" + videoTitle + "-" + crypto.randomBytes(8).toString("hex") + "." + format;

            stream.on("finish", () => {
                io.emit("video-downloaded", "/static/" + videoRelativePath);
            });

            const videoPath = staticPath + videoRelativePath;
            stream.pipe(fs.createWriteStream(videoPath));
        } else {
            io.emit("wrong-url");
        }
    });
});

http.listen(3000, () => {
    console.log("The server is running !");
});
