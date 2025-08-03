class WeatherCard {
    constructor(name, description, effect, image) {
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.image = image;
    }
}

const weatherCards = [
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

const roadConditionTiles = [
    new RoadConditionTile("Fast Corner", "Fast Corner.png", true),
    new RoadConditionTile("Slow Corner", "Slow Corner.png", true),
    new RoadConditionTile("Hot Corner", "Hot Corner.png", true),
    new RoadConditionTile("Slipstream", "+1 Slipstream.png", false),
    new RoadConditionTile("Free Boost", "Free Boost.png", false),
    new RoadConditionTile("Weather Effects", "Weather.png", false),
];

export { WeatherCard, weatherCards, RoadConditionTile, roadConditionTiles };
