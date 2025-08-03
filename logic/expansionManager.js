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

function getExpansionDisplayString(expansions) {
    let expansionList = [];
    if (expansions.heavyRain) {
        expansionList.push("HR"); // Heavy Rain
    }
    if (expansions.tunnelVision) {
        expansionList.push("TV"); // Tunnel Vision
    }

    if (expansionList.length === 0) {
        return "";
    }

    return "<br><small>Expansions: " + expansionList.join(", ") + "</small>";
}

export { getAvailableElements, getExpansionDisplayString };
