import { tracks } from '../models/Track.js';

function customRace(raceNumber, trackAbbreviation) {
    return {
        name: `Custom Race #${raceNumber}`,
        raceNumber: raceNumber,
        season: "2025",
        track: trackAbbreviation,
        rules: "",
    }
}

function getAvailableTracks(expansions) {
    return tracks.filter(track => {
        if (!track.expansion || track.expansion === "base") {
            return true; // Base game elements are always available
        }

        switch (track.expansion) {
            case "heavyRain":
                return expansions.heavyRain;
            case "tunnelVision":
                return expansions.tunnelVision;
            default:
                return true;
        }
    });
}

function randomRace(raceNumber, scorecard) {
    let availableTracks = getAvailableTracks(scorecard.expansions);
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

export { customRace, randomRace, getAvailableTracks };
