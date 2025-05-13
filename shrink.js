


/**
 * @typedef {Object} ExportReplacement
 * @property {string} long - The original key name.
 * @property {string} short - The shortened key name.
 * @property {boolean} [remove] - Whether to remove this key from the object.
 * @property {string} [type] - The type of the value (e.g., "boolean", "Date").
 */

/**
 * List of key replacements for shrinking and growing objects.
 * @type {ExportReplacement[]}
 */
const exportReplacements = [
    { long: "players", short: "r", },
    { long: "seriesName", short: "s", },
    { long: "name", short: "n", },
    { long: "colorIndex", short: "c", },
    { long: "legend", short: "l", type: "boolean", },
    { long: "place", short: "p", },
    { long: "filename", short: "fn", remove: true, },
    { long: "lastSaveDate", short: "lsd", remove: true, type: "Date", },
    { long: "total", remove: true, },
    { long: "seed", remove: true, },
];

/**
 * Shrinks an object by replacing long keys with short keys and removing specified keys.
 * @param {Object|Array} obj - The object or array to shrink.
 * @returns {Object|Array} - The shrunk object or array.
 */
function shrink(obj) {
    if (Array.isArray(obj)) {
        return obj.map(shrink);
    } else if (typeof obj === 'object' && obj !== null) {
        const result = {}
        for (const key in obj) {
            let newKey = key;
            let remove = false;
            let type = null;
            exportReplacements.find(replacement => {
                if (replacement.long === key) {
                    newKey = replacement.short;
                    remove = replacement.remove;
                    type = replacement.type;
                }
            });
            if (remove) {
                continue;
            }

            let value = obj[key];
            if (type === "Date" && value instanceof Date) {
                value = value.valueOf();
            } else if (type === "boolean" && typeof value === 'boolean') {
                value = value ? 1 : 0;
            } else {
                value = shrink(value);
            }

            result[newKey] = value;
        }
        return result;
    } else {
        return obj;
    }
}

/**
 * Grows an object by replacing short keys with long keys and converting specified types.
 * @param {Object|Array} obj - The object or array to grow.
 * @returns {Object|Array} - The grown object or array.
 */
function grow(obj) {
    if (Array.isArray(obj)) {
        return obj.map(grow);
    } else if (typeof obj === 'object' && obj !== null) {
        const result = {}
        for (const key in obj) {
            let newKey = key;
            let type = null;
            exportReplacements.find(replacement => {
                if (replacement.short === key) {
                    newKey = replacement.long;
                    type = replacement.type;
                }
            });
            let value = grow(obj[key]);
            if (type === "boolean") {
                value = value ? true : false;
            } else if (type === "Date") {
                value = new Date(value);
            }
            result[newKey] = value;
        }
        return result;
    } else {
        return obj;
    }
}


