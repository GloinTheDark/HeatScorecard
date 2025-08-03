import { editString, infoString, placeString } from '../constants.js';
import { colorValues, textColors } from '../logic/colorManager.js';
import { getExpansionDisplayString } from '../logic/expansionManager.js';
import { closeModal } from './modalManager.js';

function createBodyElements() {
    // Create modal structure
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;

    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Create title
    const title = document.createElement('h2');
    title.innerHTML = 'HEAT:<br>PEDAL TO THE METAL<br>Online Scorecard';
    document.body.appendChild(title);

    // Create score table
    const scoreTable = document.createElement('table');
    scoreTable.id = 'scoreTable';
    document.body.appendChild(scoreTable);

    // Create buttons
    const buttonContainer = document.createElement('div');

    const addPlayerButton = document.createElement('button');
    addPlayerButton.id = 'addPlayer';
    addPlayerButton.textContent = 'Add Player';
    addPlayerButton.onclick = () => window.addRacer(false);
    buttonContainer.appendChild(addPlayerButton);

    const addLegendButton = document.createElement('button');
    addLegendButton.id = 'addLegend';
    addLegendButton.textContent = 'Add Legend';
    addLegendButton.onclick = () => window.addRacer(true);
    buttonContainer.appendChild(addLegendButton);

    const addRaceEventButton = document.createElement('button');
    addRaceEventButton.id = 'addRaceEvent';
    addRaceEventButton.textContent = 'Add Race Event';
    addRaceEventButton.onclick = window.addRaceEvent;
    buttonContainer.appendChild(addRaceEventButton);

    const startOrderButton = document.createElement('button');
    startOrderButton.id = 'startOrder';
    startOrderButton.textContent = 'Randomize Starting Order';
    startOrderButton.onclick = window.sortColumnsByTotal;
    buttonContainer.appendChild(startOrderButton);

    const clearScoresButton = document.createElement('button');
    clearScoresButton.textContent = 'Clear Scores';
    clearScoresButton.onclick = window.clearScores;
    buttonContainer.appendChild(clearScoresButton);

    const resetScorecardButton = document.createElement('button');
    resetScorecardButton.textContent = 'Reset Scorecard';
    resetScorecardButton.onclick = window.resetScorecard;
    buttonContainer.appendChild(resetScorecardButton);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load';
    loadButton.onclick = () => window.loadSaveScorecard("Load");
    buttonContainer.appendChild(loadButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => window.loadSaveScorecard("Save");
    buttonContainer.appendChild(saveButton);

    const rollWeatherButton = document.createElement('button');
    rollWeatherButton.textContent = 'Roll Weather';
    rollWeatherButton.onclick = window.rollWeather;
    buttonContainer.appendChild(rollWeatherButton);

    document.body.appendChild(buttonContainer);

    // Create QR code section
    const qrSection = document.createElement('div');
    qrSection.id = 'qrcode';
    qrSection.innerHTML = '<br><img src="qr-code.png" alt="QR Code" style="width: 200px; height: 200px;">';
    document.body.appendChild(qrSection);
}

function addRacerColumn(player, scorecard) {
    console.log("--- addRacerColumn");

    let table = document.getElementById("scoreTable");
    let nameRow = document.getElementById("nameRow");
    let cell = document.createElement("td");
    cell.classList.add(`color-cell`);

    // set the color
    let colorIndex = player.colorIndex;
    cell.style.backgroundColor = colorValues[colorIndex];
    cell.style.color = textColors[colorIndex];

    // set the name
    cell.innerHTML = `<strong>${player.title}</strong><br>${player.name} ${editString}`;
    cell.style.cursor = "pointer";
    cell.onclick = function () { window.editRacerMenu(player); };
    nameRow.appendChild(cell);

    // set the width
    cell.style.width = "100px";

    // add the score cells
    for (let race = 0; race < scorecard.getNumberOfRaces(); race++) {
        let row = document.getElementById(`race${race}`);
        if (!row) {
            console.log(`race${race} not found`);
            continue;
        }
        let cell = document.createElement("td");
        cell.onclick = function () { window.raceCellClick(player, race); };
        cell.innerText = placeString(player.place[race], scorecard.getBonus(player, race));
        row.appendChild(cell);
    }

    // add the total cell
    let totalRow = document.getElementById("totalRow");
    let totalCell = document.createElement("td");
    totalCell.id = `total_${player}`;
    totalCell.innerText = player.total;
    totalRow.appendChild(totalCell);
}

function buildTable(scorecard, seriesMap, showSeriesInfo, showRaceInfo, sortColumnsByTotal) {
    console.log("--- buildTable");
    let table = document.getElementById("scoreTable");

    let nameRow = document.createElement("tr");
    nameRow.id = "nameRow";
    let raceSeriesCell = document.createElement("td");
    raceSeriesCell.style.width = "70px";
    raceSeriesCell.style.cursor = "pointer";
    let series = seriesMap.get(scorecard.seriesName);
    raceSeriesCell.innerHTML = "<strong>Series</strong><br>" + scorecard.seriesName + " " + editString + getExpansionDisplayString(scorecard.expansions);
    raceSeriesCell.onclick = function () {
        showSeriesInfo();
    };
    nameRow.appendChild(raceSeriesCell);
    table.appendChild(nameRow);

    let icon = scorecard.getSeries().custom ? editString : infoString;

    for (let race = 0; race < scorecard.getNumberOfRaces(); race++) {
        let row = document.createElement("tr");
        row.id = `race${race}`;
        let raceRowHeaderCell = document.createElement("td");
        raceRowHeaderCell.style.width = "50px";
        raceRowHeaderCell.style.height = "50px";
        raceRowHeaderCell.style.cursor = "pointer";
        let eventCard = scorecard.getSeries().eventCards[race];
        raceRowHeaderCell.innerHTML = `<strong>Race ${race + 1}</strong><br>${eventCard.track} ${icon}`;
        raceRowHeaderCell.onclick = function () {
            showRaceInfo(race);
        };
        row.appendChild(raceRowHeaderCell);
        table.appendChild(row);
    }

    // Add total row
    let totalRow = document.createElement("tr");
    totalRow.id = "totalRow";
    let totalCell = document.createElement("td")
    totalCell.innerText = "Total Points";
    totalCell.onclick = function () { sortColumnsByTotal(); };
    totalRow.appendChild(totalCell);
    table.appendChild(totalRow);

    scorecard.players.forEach(player => {
        addRacerColumn(player, scorecard);
    });
}

export { createBodyElements, addRacerColumn, buildTable };
