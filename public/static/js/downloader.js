const socket = io();
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const videoInput = document.getElementsByName("video-url")[0];
const downloadLink = document.getElementById("download-link");

let isDownloading = false;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isDownloading) {
        setDownloading();
        socket.emit("download-video", videoInput.value);
    }
});

socket.on("video-downloaded", (videoPath) => {
    setDownloaded(videoPath);
});

function setDownloading() {
    isDownloading = true;
    downloadLink.innerHTML = "";
    submitButton.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i>';
    submitButton.setAttribute("title", "Downloading video");
    videoInput.setAttribute("disabled", true);
}

function setDownloaded(videoPath) {
    isDownloading = false;
    downloadLink.innerHTML = `<a href="${videoPath}" target="_blank" downlaod>Downloaded video</a>`;
    submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    submitButton.removeAttribute("title");
    videoInput.removeAttribute("disabled");
}
