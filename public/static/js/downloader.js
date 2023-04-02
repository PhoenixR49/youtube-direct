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

socket.on("wrong-url", () => {
    downloadLink.innerHTML = "The URL you have provided is not valid!";
    submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    submitButton.removeAttribute("title");
    videoInput.removeAttribute("disabled");
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
    downloadLink.innerHTML = `<a href="${videoPath}" download>Download video</a>`;
    submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    submitButton.removeAttribute("title");
    videoInput.removeAttribute("disabled");
}
