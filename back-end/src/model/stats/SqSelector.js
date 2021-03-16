const SqField = require("./SqField");

// Summarize query selector
class SqSelector {
    constructor(cfg) {
        let { resource, filters, fields } = cfg;
        console.assert(resource !== undefined, "Resource is required")
        this.resource = resource;
        this.filters = filters || [];

        console.assert(fields === undefined || Array.isArray(fields), {val: fields, msg: 'Incorrect fields'});
        this.fields = (fields || []).map(f => new SqField(f));
    }
}

module.exports = SqSelector;