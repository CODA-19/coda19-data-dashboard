const SqOptions = require("./SqOptions");
const SqSelector = require("./SqSelector");

class SummarizeQuery {
    constructor(cfg) {
        let {selectors, options} = cfg;
        console.assert(selectors !== undefined, "Selectors is required");
        console.assert(Array.isArray(selectors), {val: selectors, msg: "Incorrect Selectors"});
        console.assert(selectors.length > 0, {val: selectors, msg: "Must have at least one selector"});
        this.selectors = selectors.map(s => new SqSelector(s));

        console.assert(options !== undefined, "Options is required");
        this.options = new SqOptions(options);
    }
}

module.exports = SummarizeQuery;