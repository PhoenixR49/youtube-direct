const socket = io();
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const videoInput = document.getElementsByName("videoURL")[0];
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

socket.on("video-downloaded", (videoPath) => {
    setDownloaded(videoPath);
});

socket.on("wrong-url", () => {
    if (document.querySelector("html").lang === "en") {
        downloadLink.innerHTML = "The link you have provided is not valid !";
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    } else if (document.querySelector("html").lang === "fr") {
        downloadLink.innerHTML = "Le lien que vous avez fournit n'est pas valide !";
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Télécharger';
    } else if (document.querySelector("html").lang === "ch") {
        downloadLink.innerHTML = "您提供的链接无效！";
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;下载';
    }
    videoInput.removeAttribute("disabled");
    formatInput.removeAttribute("disabled");
    submitButton.removeAttribute("disabled");
    isDownloading = false;
});

function setDownloading() {
    isDownloading = true;
    downloadLink.innerHTML = "";
    submitButton.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i>';
    videoInput.setAttribute("disabled", true);
    formatInput.setAttribute("disabled", true);
    submitButton.setAttribute("disabled", true);
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
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    } else if (document.querySelector("html").lang === "fr") {
        if (formatInput.value === "mp4") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Télécharger la vidéo</a>`;
        } else if (formatInput.value === "mp3") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Télécharger l'audio</a>`;
        }
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Télécharger';
    } else if (document.querySelector("html").lang === "ch") {
        if (formatInput.value === "mp4") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;下载影片</a>`;
        } else if (formatInput.value === "mp3") {
            downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;下载音频</a>`;
        }
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;下载';
    }
    submitButton.removeAttribute("disabled");
    formatInput.removeAttribute("disabled");
    videoInput.removeAttribute("disabled");
}
