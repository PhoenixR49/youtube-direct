const socket = io();
(() => {
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                if (!form.checkValidity()) {
                    event.stopPropagation();
                } else if (window.location.pathname === "/" && !isDownloading) {
                    setDownloading();
                    socket.emit("download-video", { url: videoInput.value, format: formatInput.value });
                } else if (window.location.pathname === "/security-report") {
                    let authorInput;
                    let descriptionInput;
                    for (const input of document.querySelectorAll("input")) {
                        if (input.getAttribute("name") === "author") {
                            authorInput = input;
                        }
                    }
                    for (const textarea of document.querySelectorAll("textarea")) {
                        if (textarea.getAttribute("name") === "description") {
                            descriptionInput = textarea;
                        }
                    }
                    const subjectInput = document.getElementsByName("subject")[0];
                    socket.emit("security-issue", { author: authorInput.value, subject: subjectInput.value, description: descriptionInput.value });
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();
