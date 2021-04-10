import {
    SummarizeRequestBody,
    SummarizeRequestMeasures,
    SummarizeRequestOptions,
    SummarizeRequestSelector,
    SummaryOperator
} from "../../coda19-ts/src/request/SummarizeRequest";

import{ format, addDays } from 'date-fns';

export class SRBld {
    selectors: SummarizeRequestSelector[];
    options: SummarizeRequestOptions;

    constructor() {
        this.options = { measures: { continuous:[], categorical: [] } }
        this.selectors = [];
    }

    addMeasures(measures: SummarizeRequestMeasures) : SRBld {
        this.options.measures = {...this.options.measures, ...measures};
        return this;
    }

    addSelector(selector: SRSBld) : SRBld {
        this.selectors.push(selector.selector);
        return this;
    }

    build() : SummarizeRequestBody {
        return {
            selectors: this.selectors,
            options: this.options
        }
    }
}

export class SRSBld {
    selector: SummarizeRequestSelector;

    constructor(resourceId: string) {
        this.selector = { resource: resourceId, fields: [], filters: [] }
    }

    join(selector: SRSBld): SRSBld {
        this.selector.joins = selector.selector;
        return this;
    }
    filterDateBefore(path: string, date: Date): SRSBld {
        return this.filterDate(path, "before", date);
    }
    filterDateAfterOrOn(path: string, date: Date): SRSBld {
        return this.filterDate(path, "afterOrOn", date);
    }
    filterDateOn(path: string, date: Date): SRSBld {
        this.filterDateAfterOrOn(path, date);
        this.filterDateBefore(path, addDays(date, 1));
        return this;
    }
    filterIs(path: string, value: string): SRSBld {
        this.selector.filters.push({ path: path, operator: "is", value: value })
        return this;
    }

    private filterDate(path: string, operator: SummaryOperator, date: Date): SRSBld {
        this.selector.filters.push({ path: path, operator: operator, value: format(date, "yyyy-MM-dd") })
        return this;
    }

    breakdownPerDay(type: string, field: string): SRSBld {
        this.selector.breakdown = {
            "resource": {
                "type": type,
                "field": field
            },
            "slices": { "step": 86400 /* Number of seconds in a day */ }
        }
        return this;
    }
}

export class SRBuilder {
    static newReq(): SRBld { return new SRBld(); }
    static newSel(resourceId: string): SRSBld { return new SRSBld(resourceId); }
}
