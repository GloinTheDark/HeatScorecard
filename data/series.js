import { eventCards } from './eventCards.js';

const seriesList = [
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
        comment: "From HEAT: Tunnel Vision, 4 Race Series",
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

const seriesMap = new Map();
for (let series of seriesList) {
    seriesMap.set(series.name, series);
}

function getAvailableSeries(expansions) {
    return seriesList.filter(series => {
        if (!series.expansion || series.expansion === "base") {
            return true; // Base game elements are always available
        }

        switch (series.expansion) {
            case "heavyRain":
                return expansions.heavyRain;
            case "tunnelVision":
                return expansions.tunnelVision;
            default:
                return true;
        }
    });
}

export { seriesList, seriesMap, getAvailableSeries };
