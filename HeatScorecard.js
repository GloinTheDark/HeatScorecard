

class Track {
    constructor(name, abbreviation, laps, length, turns, chicanes, expansion = "base") {
        this.name = name;
        this.abbreviation = abbreviation;
        this.laps = laps;
        this.length = length;
        this.turns = turns;
        this.chicanes = chicanes;
        this.expansion = expansion; // "base", "heavyRain", "tunnelVision"
    }

    get imageName() {
        return `${this.abbreviation}.png`;
    }
}

let infoString = "ℹ️";
let editString = "✏️";

let tracks = [
    new Track("Great Britain", "GB", 2, 63, 5, [], "base"),
    new Track("United States", "USA", 2, 69, 4, [], "base"),
    new Track("Italy", "ITA", 3, 54, 3, [], "base"),
    new Track("France", "FRA", 2, 60, 5, [], "base"),
    new Track("Mexico", "MEX", 3, 60, 6, [1, 4], "heavyRain"),
    new Track("Japan", "JPN", 2, 60, 5, [1], "heavyRain"),
    new Track("Spain", "ESP", 1, 109, 11, [3, 9], "tunnelVision"),
    new Track("Netherlands", "NED", 3, 55, 5, [1], "tunnelVision"),
];

let trackMap = new Map();
tracks.forEach(track => {
    trackMap.set(track.abbreviation, track);
});

function customRace(raceNumber, trackAbbreviation) {
    return {
        name: `Custom Race #${raceNumber}`,
        raceNumber: raceNumber,
        season: "2025",
        track: trackAbbreviation,
        rules: "",
    }
}

function randomRace(raceNumber) {
    let availableTracks = getAvailableTracks();
    if (availableTracks.length === 0) {
        // Fallback to base game tracks if no tracks are available
        availableTracks = tracks.filter(track => track.expansion === "base");
    }

    // Get the previous track to avoid repeating it
    let previousTrack = null;
    if (raceNumber > 1) {
        let series = scorecard.getSeries();
        if (series && series.eventCards && series.eventCards.length >= raceNumber - 1) {
            previousTrack = series.eventCards[raceNumber - 2].track;
        }
    }

    // Filter out the previous track if we have more than one available track
    if (previousTrack && availableTracks.length > 1) {
        availableTracks = availableTracks.filter(track => track.abbreviation !== previousTrack);
    }

    return customRace(raceNumber, availableTracks[Math.floor(Math.random() * availableTracks.length)].abbreviation);
}

let eventCards = [
    {
        name: "New Grandstand Inauguration",
        raceNumber: 1,
        season: "1961",
        track: "GB",
        rules: "First three drivers to cross the Finish Line on the 1st lap immediately gain a sponsorship card.",
        sponsorshipCards: 2,
        pressBoxes: ["A", "C"],
    },
    {
        name: "New Speed Record!",
        raceNumber: 2,
        season: "1961",
        track: "USA",
        rules: "Each time you reach a Speed of 15 or more, immediately gain a Sponsorship card.",
        sponsorshipCards: 1,
        pressBoxes: ["B"],
    },
    {
        name: "Drivers' Strike",
        raceNumber: 3,
        season: "1961",
        track: "ITA",
        rules: "This race is one lap shorter than usual. The winner of this race is awarded 2 extra Championship points.",
        sponsorshipCards: 1,
        pressBoxes: ["C"],
        bonusPlaces: 1,
        pointBonus: 2,
    },
    {
        name: "Engine Restrictions Lifted",
        raceNumber: 1,
        season: "1962",
        track: "ITA",
        rules: "All drivers start the race with an extra Heat card from the reserve in their Engine spot.",
        sponsorshipCards: 2,
        pressBoxes: ["E"],
    },
    {
        name: "Record Crowds",
        raceNumber: 2,
        season: "1962",
        track: "GB",
        rules: "This race is one lap longer than usual and hand size is increased to 8 cards.",
        sponsorshipCards: 1,
        pressBoxes: ["C", "E"],
    },
    {
        name: "Corruption in Rules Committee",
        raceNumber: 3,
        season: "1962",
        track: "FRA",
        rules: "The top 3 finishers of this race are awarded an extra Championship point.",
        sponsorshipCards: 1,
        pressBoxes: ["C"],
        bonusPlaces: 3,
        pointBonus: 1
    },
    {
        name: "New Title Sponsor",
        raceNumber: 1,
        season: "1963",
        track: "USA",
        rules: "No Special Rules.",
        sponsorshipCards: 3,
        pressBoxes: ["A"],
    },
    {
        name: "First Live Televised Race",
        raceNumber: 2,
        season: "1963",
        track: "GB",
        rules: "If you pass 3 cars in a single round, immediately gain a Sponsorship card.",
        sponsorshipCards: 1,
        pressBoxes: ["B", "D"],
    },
    {
        name: "New Safety Regulations",
        raceNumber: 3,
        season: "1963",
        track: "FRA",
        rules: "All drivers start the race with 2 less Heat cards and 1 less Stress card than usual. Hand size is reduced to 6 cards.",
        sponsorshipCards: 1,
        pressBoxes: ["D"],
    },
    {
        name: "Title Sponsor Withdraws Future Unknown",
        raceNumber: 4,
        season: "1963",
        track: "ITA",
        rules: "All drivers start the race with an extra Stress card from the reserve in their Deck. If you spin out, you are eliminated from the race and score 0 Championship points.",
        sponsorshipCards: 0,
        pressBoxes: ["D"],
    },
    {
        name: "Going Global",
        raceNumber: 1,
        season: "1964",
        track: "JPN",
        rules: "In Press Corners, you gain 2 Sponsorship cards instead of one.",
        sponsorshipCards: 0,
        pressBoxes: ["B", "C"],
    },
    {
        name: "Turbulent Winds",
        raceNumber: 2,
        season: "1964",
        track: "FRA",
        rules: "You may only Slipstream if you are in 3rd or 4th gear.",
        sponsorshipCards: 1,
        pressBoxes: ["B"],
    },
    {
        name: "Chicanes for Increased Safety",
        raceNumber: 3,
        season: "1964",
        track: "MEX",
        rules: "For this race, you may discard Heat cards during step 8.",
        sponsorshipCards: 1,
        pressBoxes: ["C"],
    },
    {
        name: "Sudden Heavy Rain Delays Race",
        raceNumber: 4,
        season: "1964",
        track: "JPN",
        rules: "Nobody benefits from Adrenaline this race.",
        sponsorshipCards: 1,
    },
    {
        name: "Hold on Tight",
        raceNumber: 1,
        season: "1965",
        track: "GB",
        rules: "A maximum of 1 card may be discarded per turn.",
        sponsorshipCards: 2,
        pressBoxes: ["D"],
    },
    {
        name: "Smile and Wave",
        raceNumber: 2,
        season: "1965",
        track: "USA",
        rules: "In Press Corners, you only gaina Sponsorship card if driving slower than the speed limit.",
        sponsorshipCards: 0,
        pressBoxes: ["C"],
    },
    {
        name: "Tunnel Vision",
        raceNumber: 3,
        season: "1965",
        track: "ESP",
        rules: "For this race, you may discard Stress cards during step 8.",
        sponsorshipCards: 0,
        pressBoxes: ["A", "C"],
    },
    {
        name: "The Pressure Cooker",
        raceNumber: 4,
        season: "1965",
        track: "NED",
        rules: "This race is one lap longer than usual. Each time you complete a lap, remove a Heat card from the game (Step 8, remove from: Engine > Hand > Discard > Draw deck).",
        sponsorshipCards: 1,
        pressBoxes: ["B"],
    },
];
let seriesList = [
    {
        name: "1961",
        comment: "The inaugural season of HEAT: Pedal to the Metal, 3 Race Series",
        eventCards: eventCards.filter(card => card.season === "1961"),
        expansion: "base"
    },
    {
        name: "1962",
        comment: "The second season of HEAT: Pedal to the Metal, 2 Race Series",
        eventCards: eventCards.filter(card => card.season === "1962"),
        expansion: "base"
    },
    {
        name: "1963",
        comment: "The third season of HEAT: Pedal to the Metal, 4 Race Series",
        eventCards: eventCards.filter(card => card.season === "1963"),
        expansion: "base"
    },
    {
        name: "GOAT",
        comment: "Greatest of All Time: 1961-1963, 10 Race series",
        eventCards: eventCards.filter(card => ["1961", "1962", "1963"].includes(card.season)),
        expansion: "base"
    },
    {
        name: "1964",
        comment: "From HEAT: Heavy Rain, 4 Race Series",
        eventCards: eventCards.filter(card => card.season === "1964"),
        expansion: "heavyRain"
    },
    {
        name: "1965",
        comment: "From HEAT: Tunnel Vision",
        eventCards: eventCards.filter(card => card.season === "1965"),
        expansion: "tunnelVision"
    },
    {
        name: "Custom",
        custom: true,
        comment: "Custom series.",
        eventCards: [],
        expansion: "base"
    }

];

let seriesMap = new Map();
for (let series of seriesList) {
    seriesMap.set(series.name, series);
}

placeNames = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "DNF"];
placePoints = [0, 9, 6, 4, 3, 2, 1, 0, 0, 0];

function placeString(place, bonus) {
    if (place === 0) return "";
    if (bonus) return `${placeNames[place]} (${placePoints[place]}+${bonus})`;
    return `${placeNames[place]} (${placePoints[place]})`;
}

class Racer {
    name = "";
    colorIndex = 0;
    legend = false;
    place = [];
    total = 0;

    constructor(name, colorIndex, legend) {
        this.name = name;
        this.colorIndex = colorIndex;
        this.legend = legend;
    }

    get title() {
        return this.legend ? "Legend" : "Player";
    }

    clone() {
        return Racer.clone(this);
    }

    static clone(other) {
        if (other && typeof other === 'object') {
            if (other.hasOwnProperty('place')) {
                let newRacer = new Racer(other.name, other.colorIndex, other.legend);
                newRacer.place = structuredClone(other.place);
                newRacer.total = other.total;
                return newRacer;
            }
        }
        return undefined;
    }

    static reviver(key, value) {
        let r = Racer.clone(value);
        if (r) return r;
        return value;
    }
}

class Scorecard {
    seriesName = "";
    date = undefined;
    players = [];
    filename = undefined;
    customTracks = [];
    expansions = {
        heavyRain: false,
        tunnelVision: false
    };
    constructor(seriesName, players) {
        this.seriesName = seriesName;
        this.appendRacers(players);
    }

    clone() {
        return Scorecard.clone(this);
    }

    static clone(other) {
        let newScorecard = new Scorecard(other.seriesName, other.players);
        newScorecard.filename = other.filename;
        newScorecard.customTracks = structuredClone(other.customTracks);
        newScorecard.lastSaveDate = structuredClone(other.lastSaveDate);
        newScorecard.expansions = structuredClone(other.expansions) || {
            heavyRain: false,
            tunnelVision: false
        };
        let series = newScorecard.getSeries();
        if (series.custom) {
            series.eventCards = [];
            // loop over customTracks and set the eventCards track to the custom track
            for (let i = 0; i < newScorecard.customTracks.length; i++) {
                series.eventCards.push(customRace(i + 1, newScorecard.customTracks[i]));
            }
        }
        newScorecard.fix();
        return newScorecard;
    }

    getSeries() {
        return seriesMap.get(this.seriesName);
    }

    getNumberOfRacers() {
        return this.players.length;
    }

    getNumberOfRaces() {
        return this.getSeries().eventCards.length;
    }

    getNumberOfRacesCompleted() {
        let count = 0;
        for (let i = 0; i < this.getNumberOfRaces(); i++) {
            let found = false
            for (let player of this.players) {
                if (player.place[i] === 0) {
                    found = true;
                    break;
                }
            }
            if (!found) count++;
        }
        return count;
    }

    appendRacer(racer) {
        if (racer instanceof Racer) {
            this.players.push(racer.clone());
        } else {
            let r = new Racer(racer.name, racer.colorIndex, racer.legend);
            r.place = structuredClone(racer.place);
            r.total = racer.total;
            this.appendRacer(r);
        }
    }

    appendRacers(players) {
        for (let player of players) {
            this.appendRacer(player);
        }
    }

    deleteRacer(player) {
        let index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    clearScores() {
        for (let player of this.players) {
            player.place = new Array(this.getNumberOfRaces()).fill(0);
        }
        this.updateRacerTotals();
    }

    fix() {
        for (let player of this.players) {
            while (player.place.length > this.getNumberOfRaces()) {
                player.place.pop();
            }
            while (player.place.length < this.getNumberOfRaces()) {
                player.place.push(0);
            }
        }
        this.updateRacerTotals();
        return this;
    }

    updateRacerTotals() {
        let series = this.getSeries();
        for (let player of this.players) {
            let total = 0;
            for (let i = 0; i < series.eventCards.length; i++) {
                let place = player.place[i];
                // check to see if this event gives bonus points
                let eventCard = series.eventCards[i];
                if (eventCard.bonusPlaces) {
                    if (place > 0 && place <= eventCard.bonusPlaces) {
                        total += eventCard.pointBonus;
                    }
                }
                total += placePoints[place];
                player.total = total;
            }
        }
    }

    getBonus(player, race) {
        let place = player.place[race];
        let eventCard = this.getSeries().eventCards[race];
        if (eventCard.bonusPlaces && place > 0 && place <= eventCard.bonusPlaces) {
            return eventCard.pointBonus;
        }
        return 0;
    }

    getCurrentEventCard() {
        let race = 0;
        let l = scorecard.getSeries().eventCards.length;
        for (let player of this.players) {
            for (let i = 0; i < l; i++) {
                if (player.place[i] == 0) {
                    return scorecard.getSeries().eventCards[i];
                }
            }
        }

        return scorecard.getSeries().eventCards[l - 1];
    }

    getSaveString() {
        if (this.getSeries().custom) {
            this.customTracks = [];
            // loop over envent cards and add the track abbreviation to tracks
            for (let eventCard of this.getSeries().eventCards) {
                this.customTracks.push(eventCard.track);
            }
        }
        return JSON.stringify(this, (key, value) => {
            switch (key) {
                case "seed":
                case "total":
                    return undefined;
            }
            return value;
        });
    }

    static exportReplacer(key, value) {
        switch (key) {
            case "seed":
            case "filename":
            case "total":
            case "lastSaveDate":
                return undefined;
        }
        return value;
    }

    static reviver(key, value) {
        if (value && typeof value === 'object') {
            if (value.hasOwnProperty('place')) {
                return Racer.clone(value);
            } else if (value.hasOwnProperty('seriesName')) {
                return Scorecard.clone(value);
            }
        }
        if (key === "lastSaveDate") {
            return new Date(value);
        }
        return value;
    }

    matches(other) {
        if (this.seriesName !== other.seriesName) return false;
        if (this.players.length !== other.players.length) return false;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name !== other.players[i].name) return false;
            if (this.players[i].colorIndex !== other.players[i].colorIndex) return false;
            for (let j = 0; j < this.getNumberOfRaces(); j++) {
                if (this.players[i].place[j] !== other.players[i].place[j]) return false;
            }
        }
        // if (this.lastSaveDate != other.lastSaveDate) return false;
        if (this.filename !== other.filename) return false;
        return true;
    }

    isModified() {
        let savedScorecards = getSavedScorecards();
        for (let savedScorecard of savedScorecards) {
            if (this.matches(savedScorecard)) {
                return false;
            }
        }
        if (this.matches(defaultScoreCard.fix())) return false;
        return true;
    }

    hasScores() {
        for (let player of this.players) {
            for (let i = 0; i < this.getNumberOfRaces(); i++) {
                if (player.place[i] > 0) return true;
            }
        }
        return false;
    }

}

let defaultScoreCard = new Scorecard("1961", [
    new Racer("Mario", 3, false),
    new Racer("Luigi", 2, false),
]);

let scorecard = defaultScoreCard.clone();

let colorData = [
    { name: "Yellow", value: "yellow", text: "black", expansion: "base" },
    { name: "Blue", value: "blue", text: "white", expansion: "base" },
    { name: "Green", value: "green", text: "white", expansion: "base" },
    { name: "Red", value: "red", text: "white", expansion: "base" },
    { name: "Black", value: "black", text: "white", expansion: "base" },
    { name: "Gray", value: "lightgray", text: "black", expansion: "base" },
    { name: "Orange", value: "orange", text: "black", expansion: "heavyRain" },
    { name: "Purple", value: "purple", text: "white", expansion: "tunnelVision" }
];

// Maintain backward compatibility with existing arrays
let colorNames = colorData.map(color => color.name);
let colorValues = colorData.map(color => color.value);
let textColors = colorData.map(color => color.text);

function getAvailableElements(elementList, expansions) {
    return elementList.filter(element => {
        if (!element.expansion || element.expansion === "base") {
            return true; // Base game elements are always available
        }

        switch (element.expansion) {
            case "heavyRain":
                return expansions.heavyRain;
            case "tunnelVision":
                return expansions.tunnelVision;
            default:
                return true;
        }
    });
}

function getAvailableTracks() {
    return getAvailableElements(tracks, scorecard.expansions);
}

function getAvailableSeries() {
    return getAvailableElements(seriesList, scorecard.expansions);
}

function getAvailableColors() {
    return getAvailableElements(colorData, scorecard.expansions);
}

function hasAvailableColors() {
    let usedColors = scorecard.players.map(score => score.colorIndex);
    let availableColors = getAvailableColors();

    // Check if there are any available colors that aren't already used
    for (let colorData of availableColors) {
        let colorIndex = colorNames.indexOf(colorData.name);
        if (!usedColors.includes(colorIndex)) {
            return true;
        }
    }

    return false;
}

function getExpansionDisplayString() {
    let expansions = [];
    if (scorecard.expansions.heavyRain) {
        expansions.push("HR"); // Heavy Rain
    }
    if (scorecard.expansions.tunnelVision) {
        expansions.push("TV"); // Tunnel Vision
    }

    if (expansions.length === 0) {
        return "";
    }

    return "<br><small>Expansions: " + expansions.join(", ") + "</small>";
}

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

window.ontouchend = function (event) {
    // TODO
    // test on ios and android
}

function addRacerColumn(player) {
    console.log("--- addRacerColumn");
    // console.log(player);

    let table = document.getElementById("scoreTable");
    let nameRow = document.getElementById("nameRow");
    let cell = document.createElement("td");
    cell.classList.add(`color-cell`);
    // cell.id = `name${player.name}`;

    // set the color
    let colorIndex = player.colorIndex;
    cell.style.backgroundColor = colorValues[colorIndex];
    cell.style.color = textColors[colorIndex];

    // set the name
    cell.innerHTML = `<strong>${player.title}</strong><br>${player.name} ${editString}`;
    cell.style.cursor = "pointer";
    cell.onclick = function () { editRacerMenu(player); };
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
        cell.onclick = function () { raceCellClick(player, race); };
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

function buildTable() {
    console.log("--- buildTable");
    let table = document.getElementById("scoreTable");

    let nameRow = document.createElement("tr");
    nameRow.id = "nameRow";
    let raceSeriesCell = document.createElement("td");
    raceSeriesCell.style.width = "70px";
    raceSeriesCell.style.cursor = "pointer";
    let series = seriesMap.get(scorecard.seriesName);
    raceSeriesCell.innerHTML = "<strong>Series</strong><br>" + scorecard.seriesName + " " + editString + getExpansionDisplayString();
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
        addRacerColumn(player);
    });
};

function saveScores() {
    console.log("--- saveScores");
    saveString = scorecard.getSaveString();
    console.log(saveString);
    localStorage.setItem("scorecard", saveString);
}

function loadScores() {
    // todo remove later
    {
        let scores = localStorage.getItem("scoreCard");
        if (scores) {
            localStorage.removeItem("scoreCard");
            localStorage.setItem("scorecard", scores);
        }
    }
    console.log("--- loadScores");
    let scores = localStorage.getItem("scorecard");
    if (scores) {
        scorecard = JSON.parse(scores, Scorecard.reviver);
    } else {
        scorecard = defaultScoreCard.clone();
    }
    rebuildTable();
}
function rebuildTable() {
    console.log("--- rebuildTable");
    // clear the table
    let table = document.getElementById("scoreTable");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    document.getElementById("addPlayer").disabled = scorecard.getNumberOfRacers() >= 8 || !hasAvailableColors();
    document.getElementById("addLegend").disabled = scorecard.getNumberOfRacers() >= 8 || !hasAvailableColors();
    document.getElementById("addRaceEvent").disabled = !scorecard.getSeries().custom;
    document.getElementById("startOrder").innerHTML = (scorecard.hasScores() ? "Sort by" : "Randomize") + " Starting Order";
    buildTable();
}

function raceCellClick(player, race) {
    let cell = event.target;
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
    saveScores();
    rebuildTable();
}


async function clearScores() {
    if (await myConfirm("Are you sure you want to clear scores?")) {
        scorecard.clearScores();
        saveScores();
        rebuildTable();
    }
}

async function resetScorecard() {
    if (await myConfirm("Are you sure you want to reset the scorecard?")) {
        // Save the current expansion settings
        let currentExpansions = structuredClone(scorecard.expansions);

        scorecard = defaultScoreCard.clone();

        // Restore the expansion settings
        scorecard.expansions = currentExpansions;

        saveScores();
        rebuildTable();
    }
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
        console.log("Change Track Button created");
        changeTrackButton.onclick = function () {
            console.log("Change Track clicked");
            closeModal();
            let availableTracks = getAvailableTracks();
            let buttons = availableTracks.map((track, index) => ({
                text: track.name,
                info: `${track.laps} laps, ${track.turns} turns` + (track.expansion !== "base" ? ` (${track.expansion === "heavyRain" ? "Heavy Rain" : "Tunnel Vision"})` : ""),
                action: function () {
                    eventCard.track = track.abbreviation;
                    saveScores();
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
        console.log("Close Race Info");
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
        let availableSeries = getAvailableSeries();
        let buttons = availableSeries.map((series, index) => ({
            text: series.name,
            info: series.comment + (series.expansion !== "base" ? ` (${series.expansion === "heavyRain" ? "Heavy Rain" : "Tunnel Vision"})` : ""),
            action: function () {
                scorecard.seriesName = series.name;
                if (series.custom) {
                    series.eventCards = [randomRace(1)];
                }
                scorecard.clearScores();
                saveScores();
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

    // addadd a close button
    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.onclick = function () {
        closeModal();
    };
    popupSeriesInfo.appendChild(closeButton);

    openModalDiv(popupSeriesInfo);
}

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
        // set focus to the button

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
        console.log("Expansion settings updated:", scorecard.expansions);

        // Check if current series is still available
        let availableSeries = getAvailableSeries();
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
        let availableColors = getAvailableColors();
        let availableColorIndices = availableColors.map(color => colorNames.indexOf(color.name));

        for (let player of scorecard.players) {
            if (!availableColorIndices.includes(player.colorIndex)) {
                // Assign an available color
                let newColorIndex = getUnusedColorIndex();
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

async function loadSaveScorecard(mode, confirm = true) {
    if (mode === "Load" && confirm && scorecard.isModified() && !await myConfirm("You have unsaved changes. Are you sure you want to load a new scorecard?", "Load Without Saving", "Cancel")) {
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
        } else
            if (selectedRow) {
                let index = Array.from(selectedRow.parentNode.children).indexOf(selectedRow) - 1;
                if (index >= 0) {
                    scorecard = getSavedScorecards()[index];
                    saveScores();
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

function renameRacer(racer) {
    popupTextInputPrompt(
        `Enter new name for ${racer.title}:`,
        racer.name,
        function (newName) {
            if (newName) {
                racer.name = newName;
                saveScores();
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
        saveScores();
        rebuildTable();
    }

}

function sortColumnsByTotal() {
    scorecard.players.forEach(player => {
        player.seed = Math.random();
    });

    scorecard.players.sort((a, b) => {
        if (a.total === b.total) {
            for (i = a.place.length - 1; i >= 0; i--) {
                if (a.place[i] !== b.place[i]) {
                    return a.place[i] - b.place[i];
                }
            }
            return a.seed - b.seed;
        }
        return b.total - a.total;
    });
    saveScores();
    rebuildTable();
}

function getUnusedColorIndex() {
    let usedColors = scorecard.players.map(score => score.colorIndex);
    let availableColors = getAvailableColors();

    for (let colorData of availableColors) {
        let colorIndex = colorNames.indexOf(colorData.name);
        if (!usedColors.includes(colorIndex)) {
            return colorIndex;
        }
    }

    // If all available colors are used, return the first available color index
    if (availableColors.length > 0) {
        return colorNames.indexOf(availableColors[0].name);
    }

    return 0;
}

function addRaceEvent() {
    let eventCount = scorecard.getSeries().eventCards.length;
    scorecard.getSeries().eventCards.push(
        randomRace(eventCount + 1)
    );

    for (let score of scorecard.players) {
        score.place.push(0);
    }
    saveScores();
    rebuildTable();
}

function addRacer(legend) {
    let colorIndex = getUnusedColorIndex();
    let racer = new Racer(colorNames[colorIndex], colorIndex, legend);
    scorecard.appendRacer(racer);
    scorecard.fix();
    saveScores();
    rebuildTable();
}

function chooseColor(player) {
    let availableColors = getAvailableColors();
    let buttons = availableColors.map((colorData, originalIndex) => {
        // Find the original index in the full color array
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
    for (racer of scorecard.players) {
        if (racer.colorIndex === colorIndex) {
            racer.colorIndex = oldColorIndex;
        }
    }
    player.colorIndex = colorIndex;
    saveScores();
    rebuildTable();
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

    button1 = document.createElement("button");
    button1.innerText = `Rename ${title}`;
    button1.onclick = function () {
        closeModal();
        renameRacer(player);
    };
    popup.appendChild(button1);

    button2 = document.createElement("button");
    button2.innerText = "Change Color";
    button2.onclick = function () {
        closeModal();
        chooseColor(player);
    };
    popup.appendChild(button2);

    button3 = document.createElement("button");
    button3.innerText = `Delete ${title}`;
    button3.onclick = function () {
        deleteRacer(player, true);
    };
    popup.appendChild(button3);

    // <br>
    popup.appendChild(document.createElement("br"));

    // <button type="button" onclick="closeForm()">Back</button>
    button4 = document.createElement("button");
    button4.innerText = "Back";
    button4.onclick = function () {
        closeModal();
    };
    popup.appendChild(button4);

    openModalDiv(popup);
}

class WeatherCard {
    constructor(name, description, effect, image) {
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.image = image;
    }
}

weatherCards = [
    new WeatherCard("Sunny", "", "", "Sunny.png"),
    new WeatherCard("Rainy", "", "", "Rain.png"),
    new WeatherCard("Snowy", "", "", "Snow.png"),
    new WeatherCard("Cloudy", "", "", "Cloudy.png"),
    new WeatherCard("Heavy Rain", "", "", "Heavy Rain.png"),
    new WeatherCard("Foggy", "", "", "Fog.png"),
];

class RoadConditionTile {
    constructor(name, image, cornerTile) {
        this.name = name;
        this.image = image;
        this.cornerTile = cornerTile;
    }
}

roadConditionTiles = [
    new RoadConditionTile("Fast Corner", "Fast Corner.png", true),
    new RoadConditionTile("Slow Corner", "Slow Corner.png", true),
    new RoadConditionTile("Hot Corner", "Hot Corner.png", true),
    new RoadConditionTile("Slipstream", "+1 Slipstream.png", false),
    new RoadConditionTile("Free Boost", "Free Boost.png", false),
    new RoadConditionTile("Weather Effects", "Weather.png", false),
];

function circleNumberString(index) {
    // 0 -> , etc...
    return String.fromCharCode(0x2460 + index);
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
    for (rct of roadConditionTiles) {
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
            if (rct.cornerTile) {
                tileDiv.innerHTML += `on chicane between corners ${circleNumberString(c0)} and ${circleNumberString(c1)} <br>`;
            } else {
                tileDiv.innerHTML += `between corners ${circleNumberString(c1)} and ${circleNumberString(c2)} <br>`;
            }
            corner += 2;
        } else {
            if (rct.cornerTile) {
                tileDiv.innerHTML += `on corner ${circleNumberString(c0)} <br>`;
            } else {
                tileDiv.innerHTML += `between corners ${circleNumberString(c0)} and ${circleNumberString(c1)} <br>`;
            }
            corner += 1;
        }
        tileDiv.innerHTML += `<img src="${rct.image}" alt="${rct.name}" style="width: 100px; height: 100px;">`;
        weatherDiv.appendChild(tileDiv);
        rcts.splice(j, 1);
    }


    // document.body.appendChild(weatherDiv);
    document.body.insertBefore(weatherDiv, document.getElementById("qrcode"));
}


function relativeDateString(date) {
    let now = new Date();
    let diff = now - new Date(date);


    if (diff < 1000 * 60) return "just now";
    if (diff < 1000 * 60 * 2) return "1 minute ago";
    if (diff < 1000 * 60 * 60) return Math.floor(diff / (1000 * 60)) + " minutes ago";
    if (diff < 1000 * 60 * 60 * 2) return "1 hour ago";
    if (diff < 1000 * 60 * 60 * 24) return Math.floor(diff / (1000 * 60 * 60)) + " hours ago";

    if (diff < 1000 * 60 * 60 * 24 * 365) return date.toLocaleDateString(undefined, { month: "short", day: "numeric", })
        + " at "
        + date.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric", amPm: "short" });

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", });;

}

function myConfirm(message, yes = "Yes", no = "No") {
    return new Promise((resolve) => {
        let popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = message + "<br>";
        let button1 = document.createElement("button");
        button1.innerText = yes;
        button1.onclick = function () {
            resolve(true);
            closeModal();
        };
        popup.appendChild(button1);

        let button2 = document.createElement("button");
        button2.innerText = no;
        button2.onclick = function () {
            resolve(false);
            closeModal();
        };
        popup.appendChild(button2);

        openModalDiv(popup);
    });
}

function getSavedScorecards() {
    let savedScorecards = JSON.parse(localStorage.getItem("savedScorecards"), Scorecard.reviver);
    if (!savedScorecards) {
        savedScorecards = [];
    }
    return savedScorecards;
}

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

    // Create buttons - first row
    const startOrderBtn = document.createElement('button');
    startOrderBtn.id = 'startOrder';
    startOrderBtn.textContent = 'Sort by Start Order';
    startOrderBtn.onclick = sortColumnsByTotal;
    document.body.appendChild(startOrderBtn);

    const addPlayerBtn = document.createElement('button');
    addPlayerBtn.id = 'addPlayer';
    addPlayerBtn.textContent = 'Add Player';
    addPlayerBtn.onclick = () => addRacer(false);
    document.body.appendChild(addPlayerBtn);

    const addLegendBtn = document.createElement('button');
    addLegendBtn.id = 'addLegend';
    addLegendBtn.textContent = 'Add Legend';
    addLegendBtn.onclick = () => addRacer(true);
    document.body.appendChild(addLegendBtn);

    // Line break
    document.body.appendChild(document.createElement('br'));

    // Second row of buttons
    const clearScoresBtn = document.createElement('button');
    clearScoresBtn.textContent = 'Clear Scores';
    clearScoresBtn.onclick = clearScores;
    document.body.appendChild(clearScoresBtn);

    const resetScorecardBtn = document.createElement('button');
    resetScorecardBtn.textContent = 'Reset Scorecard';
    resetScorecardBtn.onclick = resetScorecard;
    document.body.appendChild(resetScorecardBtn);

    const addRaceEventBtn = document.createElement('button');
    addRaceEventBtn.id = 'addRaceEvent';
    addRaceEventBtn.textContent = 'Add Race';
    addRaceEventBtn.onclick = addRaceEvent;
    document.body.appendChild(addRaceEventBtn);

    // Line break
    document.body.appendChild(document.createElement('br'));

    // Third row of buttons
    const saveScorecardBtn = document.createElement('button');
    saveScorecardBtn.textContent = 'Save Scorecard';
    saveScorecardBtn.onclick = () => loadSaveScorecard('Save');
    document.body.appendChild(saveScorecardBtn);

    const loadScorecardBtn = document.createElement('button');
    loadScorecardBtn.textContent = 'Load Scorecard';
    loadScorecardBtn.onclick = () => loadSaveScorecard('Load');
    document.body.appendChild(loadScorecardBtn);

    // Line break
    document.body.appendChild(document.createElement('br'));

    // Weather button
    const rollWeatherBtn = document.createElement('button');
    rollWeatherBtn.textContent = 'Generate Weather';
    rollWeatherBtn.onclick = rollWeather;
    document.body.appendChild(rollWeatherBtn);

    // Line break
    document.body.appendChild(document.createElement('br'));

    // Expansion Settings button
    const expansionSettingsBtn = document.createElement('button');
    expansionSettingsBtn.textContent = 'Expansion Settings';
    expansionSettingsBtn.onclick = showExpansionSettings;
    document.body.appendChild(expansionSettingsBtn);

    // Line breaks
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));

    // QR code section
    const qrCodeDiv = document.createElement('div');
    qrCodeDiv.id = 'qrcode';

    qrCodeDiv.appendChild(document.createElement('br'));

    const qrText = document.createTextNode('Scan this code to share the link to this page.');
    qrCodeDiv.appendChild(qrText);

    qrCodeDiv.appendChild(document.createElement('br'));

    const qrImg = document.createElement('img');
    qrImg.src = 'qr-code.png';
    qrImg.alt = 'QR Code';
    qrImg.style.cssText = 'display: block; margin: 20px 0; width: 200px; height: 200px; float: none;';
    qrCodeDiv.appendChild(qrImg);

    qrCodeDiv.appendChild(document.createElement('br'));

    document.body.appendChild(qrCodeDiv);
}

function bodyload() {
    console.log("--- bodyload");
    createBodyElements();
    loadScores();
    if (scorecard.hasScores()) {
        sortColumnsByTotal();
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const debug = urlParams.get('debug');
    if (debug == 1) {
        console.log("debug mode enabled");
        // show the debug button
        let debugButton = document.createElement("button");
        debugButton.innerText = "Debug Export";
        debugButton.onclick = function () {
            // open a new tab with the scorecard json string
            // let out = JSON.stringify(scorecard, null, 1);
            let out = JSON.stringify(shrink(scorecard), null, 1);
            // let out = JSON.stringify(grow(shrink(scorecard)), null, 2);


            {
                let newWindow = window.open();
                newWindow.document.write("<pre>" + out + "</pre>");
                newWindow.document.title = "Debug";
                newWindow.document.body.style.fontFamily = "monospace";
            }
            // {
            //     let newWindow = window.open();
            //     newWindow.document.write("<pre>" + importString + "</pre>");
            //     newWindow.document.title = "Debug Import";
            //     newWindow.document.body.style.fontFamily = "monospace";
            // }
        };
        document.body.appendChild(debugButton);
    }
}

window.onload = bodyload;

