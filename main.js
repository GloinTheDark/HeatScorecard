// Main application entry point - Heat Scorecard
// Import all modules
import { Track, tracks, trackMap } from './models/Track.js';
import { Racer } from './models/Racer.js';
import { Scorecard } from './models/Scorecard.js';
import { eventCards } from './data/eventCards.js';
import { seriesList, seriesMap, getAvailableSeries } from './data/series.js';
import { weatherCards, roadConditionTiles } from './data/weather.js';
import { placeNames, placePoints, infoString, editString, placeString } from './constants.js';
import { colorData, colorNames, colorValues, textColors, getAvailableColors, hasAvailableColors, getUnusedColorIndex } from './logic/colorManager.js';
import { customRace, randomRace, getAvailableTracks } from './logic/raceGenerator.js';
import { getAvailableElements, getExpansionDisplayString } from './logic/expansionManager.js';
import { openModalDiv, closeModal } from './ui/modalManager.js';
import { popupTextInputPrompt, popupButtonWindow, myConfirm } from './ui/popupFactory.js';
import { createBodyElements, buildTable } from './ui/tableBuilder.js';
import { relativeDateString, circleNumberString } from './utils/helpers.js';
import { getSavedScorecards, saveScores, loadScores } from './storage/localStorage.js';

// Initialize application state
const defaultScoreCard = new Scorecard("1961", [
    new Racer("Mario", 3, false),
    new Racer("Luigi", 2, false),
]);

let scorecard = defaultScoreCard.clone();

// Main application functions
function rebuildTable() {
    console.log("--- rebuildTable");
    // clear the table
    let table = document.getElementById("scoreTable");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let usedColors = scorecard.players.map(score => score.colorIndex);
    let availableColorsExist = hasAvailableColors(usedColors, scorecard.expansions);

    document.getElementById("addPlayer").disabled = scorecard.getNumberOfRacers() >= 8 || !availableColorsExist;
    document.getElementById("addLegend").disabled = scorecard.getNumberOfRacers() >= 8 || !availableColorsExist;
    document.getElementById("addRaceEvent").disabled = !scorecard.getSeries().custom;
    document.getElementById("startOrder").innerHTML = (scorecard.hasScores() ? "Sort by" : "Randomize") + " Starting Order";
    buildTable(scorecard, seriesMap, showSeriesInfo, showRaceInfo, sortColumnsByTotal);
}

function raceCellClick(player, race) {
    let place = player.place[race]
    if (place === 0) {
        for (let i = 1; i <= 8; i++) {
            let taken = false;
            for (let score of scorecard.players) {
                if (score.place[race] === i) {
                    taken = true;
                    break;
                }
            }
            if (!taken) {
                place = i;
                break;
            }
        }
    } else {
        place = 0;
    }
    player.place[race] = place;
    scorecard.updateRacerTotals();
    saveScores(scorecard);
    rebuildTable();
}

async function clearScores() {
    if (await myConfirm("Are you sure you want to clear scores?")) {
        scorecard.clearScores();
        saveScores(scorecard);
        rebuildTable();
    }
}

async function resetScorecard() {
    console.log("resetScorecard function called");
    if (await myConfirm("Are you sure you want to reset the scorecard?")) {
        console.log("User confirmed reset");
        // Save the current expansion settings
        let currentExpansions = structuredClone(scorecard.expansions);

        scorecard = defaultScoreCard.clone();

        // Restore the expansion settings
        scorecard.expansions = currentExpansions;

        saveScores(scorecard);
        rebuildTable();
    } else {
        console.log("User cancelled reset");
    }
}

function addRacer(legend = false) {
    let usedColors = scorecard.players.map(score => score.colorIndex);
    let colorIndex = getUnusedColorIndex(usedColors, scorecard.expansions);
    let racer = new Racer(colorNames[colorIndex], colorIndex, legend);
    scorecard.appendRacer(racer);
    scorecard.fix();
    saveScores(scorecard);
    rebuildTable();
}

function addRaceEvent() {
    let eventCount = scorecard.getSeries().eventCards.length;
    scorecard.getSeries().eventCards.push(
        randomRace(eventCount + 1, scorecard)
    );

    for (let score of scorecard.players) {
        score.place.push(0);
    }
    saveScores(scorecard);
    rebuildTable();
}

function sortColumnsByTotal() {
    scorecard.players.forEach(player => {
        player.seed = Math.random();
    });

    scorecard.players.sort((a, b) => {
        if (a.total === b.total) {
            for (let i = a.place.length - 1; i >= 0; i--) {
                if (a.place[i] !== b.place[i]) {
                    return a.place[i] - b.place[i];
                }
            }
            return a.seed - b.seed;
        }
        return b.total - a.total;
    });
    saveScores(scorecard);
    rebuildTable();
}

function showRaceInfo(race) {
    let eventCard = scorecard.getSeries().eventCards[race];

    let popup = document.createElement("div");
    popup.width = "300px";
    popup.innerHTML = `<h3>Race Info:</h3>`;
    popup.innerHTML += `<strong>${eventCard.name}</strong><br>`;
    popup.innerHTML += `${eventCard.rules}<br>`;
    let track = trackMap.get(eventCard.track);
    popup.innerHTML += `${eventCard.season} · Race ${eventCard.raceNumber}<br>`;
    popup.innerHTML += `Track: ${track.name} (${track.abbreviation}) <br>`;
    popup.innerHTML += `Laps: ${track.laps || 1} · Length: ${track.length || 0} · Turns: ${track.turns || 0} <br>`;
    popup.innerHTML += `Sponsorship Cards: ${eventCard.sponsorshipCards || 0} <br>`;
    popup.innerHTML += `Press Boxes: ${(eventCard.pressBoxes && eventCard.pressBoxes.length > 0) ? eventCard.pressBoxes.join(", ") : "None"} <br>`;

    if (scorecard.getSeries().custom) {
        // add a button to change the track
        let changeTrackButton = document.createElement("button");
        changeTrackButton.innerText = "Change Track";
        changeTrackButton.onclick = function () {
            closeModal();
            let availableTracks = getAvailableTracks(scorecard.expansions);
            let buttons = availableTracks.map((track, index) => ({
                text: track.name,
                info: `${track.laps} laps, ${track.turns} turns` + (track.expansion !== "base" ? ` (${track.expansion === "heavyRain" ? "Heavy Rain" : "Tunnel Vision"})` : ""),
                action: function () {
                    eventCard.track = track.abbreviation;
                    saveScores(scorecard);
                    rebuildTable();
                }
            }));
            popupButtonWindow("Choose a track", buttons);
        };
        popup.appendChild(changeTrackButton);
    }

    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.onclick = function () {
        closeModal();
    };
    popup.appendChild(closeButton);

    popup.classList.add("popup");
    openModalDiv(popup);
}

function showSeriesInfo() {
    let popupSeriesInfo = document.createElement("div");
    popupSeriesInfo.classList.add("popup");
    popupSeriesInfo.innerHTML = `<h3>Series Info:</h3>`;

    let series = scorecard.getSeries();
    if (!series) {
        series = seriesList[0];
    }
    popupSeriesInfo.innerHTML += `<strong>${series.name} - ${series.comment}</strong><br>`;
    popupSeriesInfo.innerHTML += `Events: ${series.eventCards.length}<br>`;

    // Add expansion information
    let activeExpansions = [];
    if (scorecard.expansions.heavyRain) {
        activeExpansions.push("Heat: Heavy Rain");
    }
    if (scorecard.expansions.tunnelVision) {
        activeExpansions.push("Heat: Tunnel Vision");
    }

    if (activeExpansions.length > 0) {
        popupSeriesInfo.innerHTML += `<strong>Active Expansions:</strong> ${activeExpansions.join(", ")}<br>`;
    } else {
        popupSeriesInfo.innerHTML += `<strong>Active Expansions:</strong> None<br>`;
    }

    for (let eventCard of series.eventCards) {
        popupSeriesInfo.innerHTML += `<br><strong>${eventCard.season}, Race ${eventCard.raceNumber}<br>${eventCard.name}</strong><br>`;
    }

    let changeSeriesButton = document.createElement("button");
    changeSeriesButton.innerText = "Change Series";
    changeSeriesButton.onclick = function () {
        closeModal();
        let availableSeries = getAvailableSeries(scorecard.expansions);
        let buttons = availableSeries.map((series, index) => ({
            text: series.name,
            info: series.comment + (series.expansion !== "base" ? ` (${series.expansion === "heavyRain" ? "Heavy Rain" : "Tunnel Vision"})` : ""),
            action: function () {
                scorecard.seriesName = series.name;
                if (series.custom) {
                    series.eventCards = [randomRace(1, scorecard)];
                }
                scorecard.clearScores();
                saveScores(scorecard);
                rebuildTable();
            }
        }));
        popupButtonWindow("Choose a series", buttons);
    };
    popupSeriesInfo.appendChild(changeSeriesButton);

    let expansionSettingsButton = document.createElement("button");
    expansionSettingsButton.innerText = "Expansion Settings";
    expansionSettingsButton.onclick = function () {
        closeModal();
        showExpansionSettings();
    };
    popupSeriesInfo.appendChild(expansionSettingsButton);

    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.onclick = function () {
        closeModal();
    };
    popupSeriesInfo.appendChild(closeButton);

    openModalDiv(popupSeriesInfo);
}

function showExpansionSettings() {
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = "<h3>Expansion Settings</h3>";
    popup.innerHTML += "Select which expansions you are using for this scorecard:<br><br>";

    // Heavy Rain expansion checkbox
    let heavyRainDiv = document.createElement("div");
    heavyRainDiv.style.margin = "10px 0";

    let heavyRainCheckbox = document.createElement("input");
    heavyRainCheckbox.type = "checkbox";
    heavyRainCheckbox.id = "heavyRainCheckbox";
    heavyRainCheckbox.checked = scorecard.expansions.heavyRain;
    heavyRainCheckbox.style.marginRight = "8px";

    let heavyRainLabel = document.createElement("label");
    heavyRainLabel.htmlFor = "heavyRainCheckbox";
    heavyRainLabel.textContent = "Heat: Heavy Rain";
    heavyRainLabel.style.fontSize = "16px";

    heavyRainDiv.appendChild(heavyRainCheckbox);
    heavyRainDiv.appendChild(heavyRainLabel);
    popup.appendChild(heavyRainDiv);

    // Tunnel Vision expansion checkbox
    let tunnelVisionDiv = document.createElement("div");
    tunnelVisionDiv.style.margin = "10px 0";

    let tunnelVisionCheckbox = document.createElement("input");
    tunnelVisionCheckbox.type = "checkbox";
    tunnelVisionCheckbox.id = "tunnelVisionCheckbox";
    tunnelVisionCheckbox.checked = scorecard.expansions.tunnelVision;
    tunnelVisionCheckbox.style.marginRight = "8px";

    let tunnelVisionLabel = document.createElement("label");
    tunnelVisionLabel.htmlFor = "tunnelVisionCheckbox";
    tunnelVisionLabel.textContent = "Heat: Tunnel Vision";
    tunnelVisionLabel.style.fontSize = "16px";

    tunnelVisionDiv.appendChild(tunnelVisionCheckbox);
    tunnelVisionDiv.appendChild(tunnelVisionLabel);
    popup.appendChild(tunnelVisionDiv);

    // Buttons
    let buttonDiv = document.createElement("div");
    buttonDiv.style.marginTop = "20px";

    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.margin = "5px";
    saveButton.onclick = function () {
        scorecard.expansions.heavyRain = heavyRainCheckbox.checked;
        scorecard.expansions.tunnelVision = tunnelVisionCheckbox.checked;

        // Check if current series is still available
        let availableSeries = getAvailableSeries(scorecard.expansions);
        let currentSeries = scorecard.getSeries();
        let isCurrentSeriesAvailable = availableSeries.some(series => series.name === currentSeries.name);

        if (!isCurrentSeriesAvailable) {
            // Switch to a base game series
            let baseSeries = availableSeries.find(series => series.expansion === "base");
            if (baseSeries) {
                scorecard.seriesName = baseSeries.name;
                scorecard.clearScores();
            }
        }

        // Check if any player colors are no longer available
        let availableColors = getAvailableColors(scorecard.expansions);
        let availableColorIndices = availableColors.map(color => colorNames.indexOf(color.name));

        for (let player of scorecard.players) {
            if (!availableColorIndices.includes(player.colorIndex)) {
                // Assign an available color
                let newColorIndex = getUnusedColorIndex(scorecard.players.map(p => p.colorIndex), scorecard.expansions);
                player.colorIndex = newColorIndex;
            }
        }

        closeModal();
        rebuildTable(); // Refresh the table to show expansion changes
    };

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.margin = "5px";
    cancelButton.onclick = function () {
        closeModal();
    };

    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);
    popup.appendChild(buttonDiv);

    openModalDiv(popup);
}

function editRacerMenu(player) {
    let title = player.title;

    let popup = document.createElement("div");
    popup.id = "myForm";
    popup.classList.add("popup");

    let label1 = document.createElement("label");
    label1.innerText = `${title} Name:`;
    popup.appendChild(label1);

    let nameField = document.createElement("label");
    nameField.id = "formNameField";
    nameField.onclick = function () {
        closeModal();
        renameRacer(player);
    };
    nameField.classList.add("player-name");
    nameField.style.backgroundColor = colorValues[player.colorIndex];
    nameField.style.color = textColors[player.colorIndex];
    nameField.innerText = player.name;
    popup.appendChild(nameField);

    popup.appendChild(document.createElement("br"));

    let button1 = document.createElement("button");
    button1.innerText = `Rename ${title}`;
    button1.onclick = function () {
        closeModal();
        renameRacer(player);
    };
    popup.appendChild(button1);

    let button2 = document.createElement("button");
    button2.innerText = "Change Color";
    button2.onclick = function () {
        closeModal();
        chooseColor(player);
    };
    popup.appendChild(button2);

    let button3 = document.createElement("button");
    button3.innerText = `Delete ${title}`;
    button3.onclick = function () {
        deleteRacer(player, true);
    };
    popup.appendChild(button3);

    popup.appendChild(document.createElement("br"));

    let button4 = document.createElement("button");
    button4.innerText = "Back";
    button4.onclick = function () {
        closeModal();
    };
    popup.appendChild(button4);

    openModalDiv(popup);
}

function renameRacer(racer) {
    popupTextInputPrompt(
        `Enter new name for ${racer.title}:`,
        racer.name,
        function (newName) {
            if (newName) {
                racer.name = newName;
                saveScores(scorecard);
                rebuildTable();
            }
        }, racer.colorIndex);
}

function deleteRacer(player, confirm) {
    if (confirm) {
        closeModal();
        popupButtonWindow(`Are you sure you want to delete ${player.title} "${player.name}"?`, [
            { text: "Delete", action: function () { deleteRacer(player, false); } },
            { text: "Cancel" }
        ]);
    } else {
        scorecard.deleteRacer(player);
        saveScores(scorecard);
        rebuildTable();
    }
}

function chooseColor(player) {
    let availableColors = getAvailableColors(scorecard.expansions);
    let buttons = availableColors.map((colorData, originalIndex) => {
        let colorIndex = colorNames.indexOf(colorData.name);
        return {
            text: colorData.name,
            action: () => { changeColor(colorIndex, player); },
            colorIndex: colorIndex
        };
    });
    popupButtonWindow("Choose a color", buttons);
}

function changeColor(colorIndex, player) {
    let oldColorIndex = player.colorIndex;
    for (let racer of scorecard.players) {
        if (racer.colorIndex === colorIndex) {
            racer.colorIndex = oldColorIndex;
        }
    }
    player.colorIndex = colorIndex;
    saveScores(scorecard);
    rebuildTable();
}

async function loadSaveScorecard(mode, confirm = true) {
    if (mode === "Load" && confirm && scorecard.isModified(getSavedScorecards, defaultScoreCard) && !await myConfirm("You have unsaved changes. Are you sure you want to load a new scorecard?", "Load Without Saving", "Cancel")) {
        return;
    }

    let popup = document.createElement("div");
    popup.classList.add("popup");

    var fileNameInput = null;
    let selectedRow = null;

    function doLoad() {
        if (mode === "Save") {
            scorecard.filename = fileNameInput.value;
            scorecard.lastSaveDate = new Date();
            let savedScorecards = getSavedScorecards();
            let index = savedScorecards.findIndex(saved => saved.filename === scorecard.filename);
            if (index >= 0) {
                savedScorecards[index] = scorecard.clone();
            } else {
                savedScorecards.push(scorecard.clone());
            }
            localStorage.setItem("savedScorecards", JSON.stringify(savedScorecards));
        } else if (selectedRow) {
            let index = Array.from(selectedRow.parentNode.children).indexOf(selectedRow) - 1;
            if (index >= 0) {
                scorecard = getSavedScorecards()[index];
                saveScores(scorecard);
                rebuildTable();
            }
        }
        closeModal();
    }

    popup.innerHTML = `<h3>${mode} Scorecard</h3>`;

    function addSaves(div) {
        let savedScorecards = getSavedScorecards();
        const table = document.createElement('table');
        table.style.cursor = "pointer";

        const headerRow = document.createElement('tr');
        headerRow.style.height = "20px";
        function addHeaderCell(text) {
            const headerCell = document.createElement('th');
            headerCell.innerText = text;
            headerCell.style.padding = "5px";
            headerRow.appendChild(headerCell);
        }

        addHeaderCell("Name");
        addHeaderCell("Saved");
        addHeaderCell("Series");
        addHeaderCell("Players");
        addHeaderCell("Legends");
        addHeaderCell("Races");

        table.appendChild(headerRow);

        for (let i = 0; i < savedScorecards.length; i++) {
            const currentScorecard = savedScorecards[i];
            const row = document.createElement('tr');
            row.style.height = "40px";

            row.onclick = function () {
                for (let tr of table.childNodes) {
                    if (tr !== headerRow) tr.style.backgroundColor = "white";
                }
                row.style.backgroundColor = "lightgray";
                selectedRow = row;
                loadSaveButton.disabled = false;
                deleteButton.disabled = false;
                if (mode === "Save") {
                    fileNameInput.value = currentScorecard.filename;
                }
            };

            function addCell(text) {
                const cell = document.createElement('td');
                cell.innerText = text;
                cell.style.whiteSpace = "nowrap";
                cell.style.padding = "5px";
                row.appendChild(cell);
            }
            addCell(currentScorecard.filename);
            addCell(relativeDateString(currentScorecard.lastSaveDate));
            addCell(currentScorecard.seriesName);
            addCell(currentScorecard.players.filter(player => !player.legend).length);
            addCell(currentScorecard.players.filter(player => player.legend).length);
            addCell(currentScorecard.getNumberOfRacesCompleted() + " / " + currentScorecard.getNumberOfRaces());

            table.appendChild(row);
        }

        // set column widths on table
        const colWidths = ["150px", "100px", "100px", "100px", "100px", "100px"];
        for (let i = 0; i < headerRow.children.length; i++) {
            headerRow.children[i].style.width = colWidths[i];
        }

        div.appendChild(table);
    }

    addSaves(popup);

    function findUniqueName() {
        for (let i = 1; i < 100; i++) {
            let filename = "Scorecard " + i;
            if (!getSavedScorecards().find(scorecard => scorecard.filename === filename)) {
                return filename;
            }
        }
    }

    if (mode === "Save") {
        let lable = document.createElement("label");
        lable.innerText = "Name:";
        popup.appendChild(lable);
        fileNameInput = document.createElement("input");
        fileNameInput.type = "text";
        fileNameInput.value = scorecard.filename || findUniqueName();
        fileNameInput.maxLength = 20;
        fileNameInput.oninput = function () {
            if (fileNameInput.value && fileNameInput.value.length > 0) {
                loadSaveButton.disabled = false;
            } else {
                loadSaveButton.disabled = true;
            }
        };
        fileNameInput.onkeydown = function (event) {
            if (event.key === "Enter" && loadSaveButton.disabled === false) {
                doLoad();
            }
        };
        popup.appendChild(fileNameInput);
        popup.appendChild(document.createElement("br"));
    }

    let loadSaveButton = document.createElement("button");
    loadSaveButton.innerText = mode;
    loadSaveButton.onclick = doLoad;
    loadSaveButton.style.float = "right";
    loadSaveButton.disabled = mode === "Load";

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.onclick = function () {
        closeModal();
    };
    cancelButton.style.float = "right";

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function () {
        if (selectedRow) {
            let index = Array.from(selectedRow.parentNode.children).indexOf(selectedRow) - 1;
            if (index >= 0) {
                let savedScorecards = getSavedScorecards();
                savedScorecards.splice(index, 1);
                localStorage.setItem("savedScorecards", JSON.stringify(savedScorecards));
                closeModal();
                loadSaveScorecard(mode, confirm = false);
            }
        }
    };
    deleteButton.style.float = "left";
    deleteButton.disabled = true;

    popup.appendChild(deleteButton);
    popup.appendChild(cancelButton);
    popup.appendChild(loadSaveButton);

    openModalDiv(popup);
}

function rollWeather() {
    let old = document.getElementById("weatherDiv");
    if (old) {
        old.remove();
    }

    let weatherCard = weatherCards[Math.floor(Math.random() * weatherCards.length)];
    let weatherDiv = document.createElement("div");
    let eventCard = scorecard.getCurrentEventCard();
    let track = trackMap.get(eventCard.track);

    weatherDiv.id = "weatherDiv";

    weatherDiv.innerHTML = `<br><h3>Weather: for ${track.name}</h3>`;
    weatherDiv.innerHTML += `<strong>${weatherCard.name}</strong><br>`;
    weatherDiv.innerHTML += `${weatherCard.description}<br>`;
    weatherDiv.innerHTML += `<img src="${weatherCard.image}" alt="${weatherCard.name}" style="width: 400px; height: 300px;">`;
    weatherDiv.innerHTML += `<img src="${track.imageName}" alt="${track.name}" style="width: 400px; height: 300px;">`;

    let tilesToAdd = track.turns - track.chicanes.length;
    let rcts = [];
    for (let rct of roadConditionTiles) {
        rcts.push(rct);
        rcts.push(rct);
    }

    let corner = 0;
    for (let tileIndex = 0; tileIndex < tilesToAdd; tileIndex++) {
        let j = Math.floor(Math.random() * rcts.length);
        let rct = rcts[j];
        let tileDiv = document.createElement("div");
        tileDiv.innerHTML = `<br><strong>${rct.name}: </strong>`;
        let c0 = corner;
        let c1 = (corner + 1) % track.turns;
        let c2 = (corner + 2) % track.turns;

        if (track.chicanes.includes(corner)) {
            tileDiv.innerHTML += `Between Corners ${circleNumberString(c0)} and ${circleNumberString(c2)}`;
        } else {
            if (rct.cornerTile) {
                tileDiv.innerHTML += `Corner ${circleNumberString(c1)}`;
            } else {
                tileDiv.innerHTML += `Between Corners ${circleNumberString(c0)} and ${circleNumberString(c1)}`;
            }
        }
        tileDiv.innerHTML += `<img src="${rct.image}" alt="${rct.name}" style="width: 100px; height: 100px;">`;
        weatherDiv.appendChild(tileDiv);
        rcts.splice(j, 1);
        corner++;
    }

    document.body.insertBefore(weatherDiv, document.getElementById("qrcode"));
}

// Make key functions available globally for event handlers BEFORE initialization
window.scorecard = scorecard;
window.defaultScoreCard = defaultScoreCard;
window.Scorecard = Scorecard;
window.addRacer = addRacer;
window.addRaceEvent = addRaceEvent;
window.clearScores = clearScores;
window.resetScorecard = resetScorecard;
window.sortColumnsByTotal = sortColumnsByTotal;
window.loadSaveScorecard = loadSaveScorecard;
window.rollWeather = rollWeather;
window.editRacerMenu = editRacerMenu;
window.raceCellClick = raceCellClick;
window.rebuildTable = rebuildTable;
window.saveScores = () => saveScores(scorecard);

// Initialize the application
function initializeApp() {
    createBodyElements();
    scorecard = loadScores(defaultScoreCard, Scorecard);
    rebuildTable();
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export { scorecard, defaultScoreCard, Scorecard };
