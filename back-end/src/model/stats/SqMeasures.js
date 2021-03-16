class SqMeasures {
    constructor(cfg) {
        let { continuous, categorical } = cfg;
        console.assert(Array.isArray(continuous), {val: continuous, msg: "Isn't an array"})
        console.assert(Array.isArray(categorical), {val: categorical, msg: "Isn't an array"})
        this.continuous = continuous;
        this.categorical = categorical;
    }
}

module.exports = SqMeasures;