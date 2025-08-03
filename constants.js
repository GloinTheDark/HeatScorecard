export const placeNames = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "DNF"];
export const placePoints = [0, 9, 6, 4, 3, 2, 1, 0, 0, 0];

export const infoString = "ℹ️";
export const editString = "✏️";

export function placeString(place, bonus) {
    if (place === 0) return "";
    if (bonus) return `${placeNames[place]} (${placePoints[place]}+${bonus})`;
    return `${placeNames[place]} (${placePoints[place]})`;
}
