function restrictTab(div) {
    console.log("--- restrictTab");
    // only allow tab key to move focus to the next element in the div
    // and not to the next element in the document
    div.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            console.log("tab in popup");
            // prevent default tab behavior
            event.preventDefault();
            // move focus to the next element in the div
            let focusableElements = div.querySelectorAll("button, input, select, textarea");
            let index = Array.prototype.indexOf.call(focusableElements, document.activeElement);
            // not a bug. index -1 + 1 == 0
            focusableElements[(index + 1) % focusableElements.length].focus();
        } else if (event.key === "Escape") {
            console.log("escape in popup");
            // close the modal
            closeModal();
        }
    });
}

function openModalDiv(modelContentDiv) {
    console.log("--- openModalDiv");
    let modal = document.getElementById("modal");
    modal.style.display = "block";

    modal.appendChild(modelContentDiv);
    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.removeChild(modelContentDiv);
        }
    };
    restrictTab(modelContentDiv);

    let fe = modelContentDiv.querySelectorAll("button, input, select, textarea");
    if (fe && fe.length > 0) window.setTimeout(function () { fe[0].focus(); }, 0);
}

function closeModal() {
    console.log("--- closeModal");
    let modal = document.getElementById("modal");
    // remove child
    while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }
    modal.style.display = "none";
}

export { restrictTab, openModalDiv, closeModal };
