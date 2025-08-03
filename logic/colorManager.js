const colorData = [
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
const colorNames = colorData.map(color => color.name);
const colorValues = colorData.map(color => color.value);
const textColors = colorData.map(color => color.text);

function getAvailableColors(expansions) {
    return colorData.filter(color => {
        if (!color.expansion || color.expansion === "base") {
            return true; // Base game elements are always available
        }

        switch (color.expansion) {
            case "heavyRain":
                return expansions.heavyRain;
            case "tunnelVision":
                return expansions.tunnelVision;
            default:
                return true;
        }
    });
}

function hasAvailableColors(usedColorIndices, expansions) {
    const availableColors = getAvailableColors(expansions);

    // Check if there are any available colors that aren't already used
    for (let color of availableColors) {
        let colorIndex = colorNames.indexOf(color.name);
        if (!usedColorIndices.includes(colorIndex)) {
            return true;
        }
    }

    return false;
}

function getUnusedColorIndex(usedColorIndices, expansions) {
    const availableColors = getAvailableColors(expansions);

    for (let color of availableColors) {
        let colorIndex = colorNames.indexOf(color.name);
        if (!usedColorIndices.includes(colorIndex)) {
            return colorIndex;
        }
    }

    // If all available colors are used, return the first available color index
    if (availableColors.length > 0) {
        return colorNames.indexOf(availableColors[0].name);
    }

    return 0;
}

export {
    colorData,
    colorNames,
    colorValues,
    textColors,
    getAvailableColors,
    hasAvailableColors,
    getUnusedColorIndex
};
