class SqField {
    constructor(cfg) {
        let {path} = cfg;
        console.assert(path !== undefined, "path is required")
        this.path = path;
    }
}

module.exports = SqField;