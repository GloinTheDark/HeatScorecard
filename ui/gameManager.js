// Game management functions
import { Racer } from '../models/Racer.js';
import { buildTable } from './tableBuilder.js';
import { myConfirm } from './popupFactory.js';
import { saveScores } from '../storage/localStorage.js';
import { colorNames, hasAvailableColors, getUnusedColorIndex } from '../logic/colorManager.js';
import { randomRace } from '../logic/raceGenerator.js';
import { seriesMap } from '../data/series.js';
import { getExpansionDisplayString } from '../logic/expansionManager.js';

// Helper functions that need access to scorecard
export function rebuildTable(scorecard, defaultScoreCard) {
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

export function raceCellClick(player, race, scorecard) {
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
    rebuildTable(scorecard);
}

export async function clearScores(scorecard) {
    if (await myConfirm("Are you sure you want to clear scores?")) {
        scorecard.clearScores();
        saveScores(scorecard);
        rebuildTable(scorecard);
    }
}

export async function resetScorecard(scorecard, defaultScoreCard) {
    if (await myConfirm("Are you sure you want to reset the scorecard?")) {
        // Save the current expansion settings
        let currentExpansions = structuredClone(scorecard.expansions);

        scorecard = defaultScoreCard.clone();

        // Restore the expansion settings
        scorecard.expansions = currentExpansions;

        saveScores(scorecard);
        rebuildTable(scorecard);
        return scorecard;
    }
    return scorecard;
}

export function addRacer(scorecard, legend = false) {
    let usedColors = scorecard.players.map(score => score.colorIndex);
    let colorIndex = getUnusedColorIndex(usedColors, scorecard.expansions);
    let racer = new Racer(colorNames[colorIndex], colorIndex, legend);
    scorecard.appendRacer(racer);
    scorecard.fix();
    saveScores(scorecard);
    rebuildTable(scorecard);
}

export function addRaceEvent(scorecard) {
    let eventCount = scorecard.getSeries().eventCards.length;
    scorecard.getSeries().eventCards.push(
        randomRace(eventCount + 1, scorecard)
    );

    for (let score of scorecard.players) {
        score.place.push(0);
    }
    saveScores(scorecard);
    rebuildTable(scorecard);
}

export function sortColumnsByTotal(scorecard) {
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
    rebuildTable(scorecard);
}

// Placeholder functions - these would need to be implemented
export function showSeriesInfo() {
    console.log("Show series info - to be implemented");
}

export function showRaceInfo(race) {
    console.log("Show race info - to be implemented", race);
}

export function editRacerMenu(player) {
    console.log("Edit racer menu - to be implemented", player);
}

export function loadSaveScorecard(mode) {
    console.log("Load/Save scorecard - to be implemented", mode);
}

export function rollWeather() {
    console.log("Roll weather - to be implemented");
}
