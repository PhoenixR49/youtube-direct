const express = require("express");
const app = express();
const fs = require("fs");
const ytdl = require("ytdl-core");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const crypto = require("crypto");

app.use("/static", express.static(__dirname + "/public/static/"));

const pagesPath = __dirname + "/public/html/";
const staticPath = __dirname + "/public/static/";

app.get("/", (req, res) => {
    res.sendFile(pagesPath + "/home.html");
});

io.on("connection", (socket) => {
    socket.on("download-video", (videoURL) => {
        const stream = ytdl(videoURL, {
            filter: "audioandvideo",
            quality: "highest",
        });
        
        stream.on("finish", () => {
            io.emit("video-downloaded", videoPath);
        });

        const videoPath = staticPath + "videos/" + crypto.randomBytes(8).toString("hex") + "-" + Date.now() + ".mp4";
        stream.pipe(fs.createWriteStream(videoPath));
    });
});

http.listen(3000, () => {
    console.log(`The server is running !`);
});
