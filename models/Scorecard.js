import { seriesMap } from '../data/series.js';
import { customRace } from '../logic/raceGenerator.js';
import { placePoints } from '../constants.js';
import { Racer } from './Racer.js';

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
        let l = this.getSeries().eventCards.length;
        for (let player of this.players) {
            for (let i = 0; i < l; i++) {
                if (player.place[i] == 0) {
                    return this.getSeries().eventCards[i];
                }
            }
        }
        return this.getSeries().eventCards[l - 1];
    }

    getSaveString() {
        if (this.getSeries().custom) {
            this.customTracks = [];
            // loop over event cards and add the track abbreviation to tracks
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
        if (this.filename !== other.filename) return false;
        return true;
    }

    isModified(getSavedScorecards, defaultScoreCard) {
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

export { Scorecard };
