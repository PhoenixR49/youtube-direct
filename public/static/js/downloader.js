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
    if (formatInput.value === "mp4") {
        downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Download video</a>`;
    } else if (formatInput.value === "mp3") {
        downloadLink.innerHTML = `<a href="${videoPath}" download><i class="fa-solid fa-file-download"></i>&nbsp;Download audio</a>`;
    }
    if (document.querySelector("html").lang === "en") {
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Download';
    } else if (document.querySelector("html").lang === "fr") {
        submitButton.innerHTML = '<i class="fa-solid fa-download"></i>&nbsp;Télécharger';
    }
    submitButton.removeAttribute("disabled");
    formatInput.removeAttribute("disabled");
    videoInput.removeAttribute("disabled");
}
