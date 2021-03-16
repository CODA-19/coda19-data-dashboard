const SqField = require('./SqField')

class SqFilter extends SqField {
    constructor(cfg) {
        super(cfg);
        let {operator, code} = cfg;
        console.assert(operator !== undefined, "Operator is required")
        this.operator = operator;
        console.assert(code !== undefined, "Code is required")
        this.code = code;
    }
}

module.exports = SqFilter;