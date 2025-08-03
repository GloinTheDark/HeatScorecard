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

const tracks = [
    new Track("Great Britain", "GB", 2, 63, 5, [], "base"),
    new Track("United States", "USA", 2, 69, 4, [], "base"),
    new Track("Italy", "ITA", 3, 54, 3, [], "base"),
    new Track("France", "FRA", 2, 60, 5, [], "base"),
    new Track("Mexico", "MEX", 3, 60, 6, [1, 4], "heavyRain"),
    new Track("Japan", "JPN", 2, 60, 5, [1], "heavyRain"),
    new Track("Spain", "ESP", 1, 109, 11, [3, 9], "tunnelVision"),
    new Track("Netherlands", "NED", 3, 55, 5, [1], "tunnelVision"),
];

const trackMap = new Map();
tracks.forEach(track => {
    trackMap.set(track.abbreviation, track);
});

export { Track, tracks, trackMap };
