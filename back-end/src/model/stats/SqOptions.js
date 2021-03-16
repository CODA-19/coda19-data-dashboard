// Summarize Query Options
class SqOptions {
    constructor(cfg) {
        let {measures} = cfg;
        console.assert(measures !== undefined, "Measures is required");
        this.measures = measures;
    }
}

module.exports = SqOptions;
