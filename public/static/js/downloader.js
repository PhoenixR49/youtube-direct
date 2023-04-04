const socket = io();
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const videoInput = document.getElementsByName("video")[0];
const formatInput = document.getElementsByName("format")[0];
const downloadLink = document.getElementById("download-link");

let isDownloading = false;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isDownloading) {
        setDownloading();
        socket.emit("download-video", [videoInput.value, formatInput.value]);
    }
});

videoInput.addEventListener("input", (event) => {
    if (videoInput.value !== "") {
        socket.emit("videoInput-value", videoInput.value);
        setDownloadButton("undisabled");
    } else {
        setDownloadButton("disabled");
        setDownloadButton("search");
    }
});

socket.on("video-downloaded", (videoPath) => {
    setDownloaded(videoPath);
});

socket.on("download-button", (type) => {
    setDownloadButton(type);
});

socket.on("search-results", (results) => {
    setSearchResults(results);
});

socket.on("error", (error) => {
    downloadLink.innerHTML = error;
    isDownloading = false;
    setDownloadButton("undisabled");
    setDownloadButton("search");
});

socket.on("videoInput-type", (type) => {
    setDownloadButton(type);
});

function setDownloading() {
    isDownloading = true;
    downloadLink.innerHTML = "";
    setDownloadButton("downloading");
    videoInput.setAttribute("disabled", true);
    formatInput.setAttribute("disabled", true);
    setDownloadButton("disabled");
    downloadLink.innerHTML = "";
}

function setDownloaded(videoPath) {
    isDownloading = false;
    if (document.querySelector("html").lang === "en") {
        if (formatInput.value === "mp4") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Download video</a>`;
        } else if (formatInput.value === "mp3") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Download audio</a>`;
        }
    } else if (document.querySelector("html").lang === "fr") {
        if (formatInput.value === "mp4") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Télécharger la vidéo</a>`;
        } else if (formatInput.value === "mp3") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Télécharger l'audio</a>`;
        }
    } else if (document.querySelector("html").lang === "zh") {
        if (formatInput.value === "mp4") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;下载影片</a>`;
        } else if (formatInput.value === "mp3") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;下载音频</a>`;
        }
    }
    setDownloadButton("undisabled");
    setDownloadButton("search");
    formatInput.removeAttribute("disabled");
    videoInput.removeAttribute("disabled");
}

function setDownloadButton(type) {
    if (type === "downloading") {
        submitButton.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i>';
    } else if (type === "default") {
        if (document.querySelector("html").lang === "en") {
            submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
        } else if (document.querySelector("html").lang === "fr") {
            submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Télécharger';
        } else if (document.querySelector("html").lang === "zh") {
            submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;下载';
        }
    } else if (type === "search") {
        if (document.querySelector("html").lang === "en") {
            submitButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>&nbsp;Search';
        } else if (document.querySelector("html").lang === "fr") {
            submitButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>&nbsp;Chercher';
        } else if (document.querySelector("html").lang === "zh") {
            submitButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>&nbsp;寻找';
        }
    } else if (type === "disabled") {
        submitButton.setAttribute("style", "cursor: not-allowed;");
    } else if (type === "undisabled") {
        submitButton.removeAttribute("style");
    }
}

function setSearchResults(results) {
    document.querySelector(".search-results").innerHTML = "";
    isDownloading = false;
    setDownloadButton("undisabled");
    setDownloadButton("search");
    formatInput.removeAttribute("disabled");
    videoInput.removeAttribute("disabled");
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("search-result");
        resultDiv.innerHTML = `<div class="search-result"><img src="${result.thumbnail}" alt="Video thumbnail" /><div><h2>${result.title}</h2><span>${result.author}</span><p>${result.description}</p></div></div>`;
        document.querySelector(".search-results").appendChild(resultDiv);
        resultDiv.addEventListener("click", () => {
            document.querySelector(".search-results").innerHTML = "";
            setDownloading();
            socket.emit("download-video", [result.url, formatInput.value]);
        });
    }
}

setDownloadButton("disabled");
setDownloadButton("search");
