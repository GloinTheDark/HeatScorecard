import { openModalDiv, closeModal } from './modalManager.js';
import { colorValues, textColors } from '../logic/colorManager.js';

function popupTextInputPrompt(message, defaultText, action, colorIndex) {
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = message + "<br>";
    let input = document.createElement("input");
    input.style.backgroundColor = colorValues[colorIndex];
    input.style.color = textColors[colorIndex];
    input.style.padding = "10px";
    input.maxLength = 20;
    input.type = "text";
    input.value = defaultText;
    window.setTimeout(function () { input.focus(); }, 0);
    input.onfocus = function () { this.select(); };

    input.onkeydown = function (event) {
        switch (event.key) {
            case "Enter":
                if (action) action(input.value);
            case "Escape":
                closeModal();
                break;
        }
    };

    popup.appendChild(input);
    popup.appendChild(document.createElement("br"));

    let buttonElement = document.createElement("button");
    buttonElement.innerText = "OK";
    buttonElement.onclick = function () {
        if (action) action(input.value);
        closeModal();
    };
    popup.appendChild(buttonElement);

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.onclick = function () {
        closeModal();
    };
    popup.appendChild(cancelButton);
    openModalDiv(popup);
}

function popupButtonWindow(message, buttons) {
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = message + "<br>";

    for (let button of buttons) {
        let buttonElement = document.createElement("button");

        buttonElement.innerText = button.text;
        if (button.colorIndex !== undefined) {
            buttonElement.style.backgroundColor = colorValues[button.colorIndex];
            buttonElement.style.color = textColors[button.colorIndex];
        }
        buttonElement.onclick = function () {
            if (button.action) button.action();
            closeModal();
        };
        popup.appendChild(buttonElement);
        if (button.info) {
            let infoElement = document.createElement("div");
            infoElement.innerHTML = button.info;
            popup.appendChild(infoElement);
        }
    }
    openModalDiv(popup);
}

function myConfirm(message, yes = "Yes", no = "No") {
    return new Promise((resolve) => {
        let popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = message + "<br><br>";

        let yesButton = document.createElement("button");
        yesButton.innerText = yes;
        yesButton.onclick = function () {
            closeModal();
            resolve(true);
        };
        popup.appendChild(yesButton);

        let noButton = document.createElement("button");
        noButton.innerText = no;
        noButton.onclick = function () {
            closeModal();
            resolve(false);
        };
        popup.appendChild(noButton);

        openModalDiv(popup);
    });
}

export { popupTextInputPrompt, popupButtonWindow, myConfirm };
