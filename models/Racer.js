class Racer {
    name = "";
    colorIndex = 0;
    legend = false;
    place = [];
    total = 0;

    constructor(name, colorIndex, legend) {
        this.name = name;
        this.colorIndex = colorIndex;
        this.legend = legend;
    }

    get title() {
        return this.legend ? "Legend" : "Player";
    }

    clone() {
        return Racer.clone(this);
    }

    static clone(other) {
        if (other && typeof other === 'object') {
            if (other.hasOwnProperty('place')) {
                let newRacer = new Racer(other.name, other.colorIndex, other.legend);
                newRacer.place = structuredClone(other.place);
                newRacer.total = other.total;
                return newRacer;
            }
        }
        return undefined;
    }

    static reviver(key, value) {
        let r = Racer.clone(value);
        if (r) return r;
        return value;
    }
}

export { Racer };
