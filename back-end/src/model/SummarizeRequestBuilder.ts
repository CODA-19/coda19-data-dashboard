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
        this.selector = {
            resource: resourceId,
            label:"",
            fields: [],
            filters: []
        }
    }
    addLabel(label: string) {
        this.selector.label = label;
        return this;
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
    filterIs(path: string, value: string, type: string): SRSBld {
        this.selector.filters.push({ path: path, operator: "is", value: value, type: type })
        return this;
    }

    addFieldGender(): SRSBld {
        this.selector.fields.push({ path: 'gender', label: 'patient_gender', type: 'string' })
        return this;
    }

    private filterDate(path: string, operator: SummaryOperator, date: Date): SRSBld {
        this.selector.filters.push({ path: path, operator: operator, value: format(date, "yyyy-MM-dd") , type: "date"})
        return this;
    }

    addTEMPORARYWardBreakdown(minDate: Date, maxDate: Date): SRSBld {
        const fromDate = format(minDate, "yyyy-MM-dd");
        const toDate = format(maxDate, "yyyy-MM-dd");
        this.selector.breakdown = {
            "resource": {
                "type": "Encounter",
                "field": "location.period.start"
            },
            "slices": {
                "step": 24 * 60 * 60 /* Number of seconds in a day */,
                "min": format(minDate, "yyyy-MM-dd"),
                "max": format(maxDate, "yyyy-MM-dd")
            },
            "query": `SELECT SQ.period_start as period_start, count(*) AS count_in_period FROM (SELECT DISTINCT resource -> 'subject' ->> 'id' as subject_id, to_timestamp(floor((extract('epoch' from (location->'period'->>'start')::timestamp) / 86400)) * 86400) AS period_start FROM Encounter encounter_table CROSS JOIN LATERAL jsonb_array_elements(resource->'location') AS location JOIN (SELECT id FROM Location location_table CROSS JOIN LATERAL jsonb_array_elements(resource->'type') AS type CROSS JOIN LATERAL jsonb_array_elements(type->'coding') AS type_coding WHERE type_coding->>'code'='HU') location_table CROSS JOIN LATERAL jsonb_array_elements(encounter_table.resource ->'location') AS location_location ON location_location->'location'->>'id' = location_table.id WHERE location -> 'period'->>'start'>='${fromDate}' AND location->'period'->>'start'<'${toDate}') SQ GROUP BY period_start`
        }
        return this;
    }

    addTEMPORARYIcuBreakdown(minDate: Date, maxDate: Date): SRSBld {
        const fromDate = format(minDate, "yyyy-MM-dd");
        const toDate = format(maxDate, "yyyy-MM-dd");
        this.selector.breakdown = {
            "resource": {
                "type": "Encounter",
                "field": "location.period.start"
            },
            "slices": {
                "step": 24 * 60 * 60 /* Number of seconds in a day */ ,
                "min": fromDate,
                "max": toDate
            },
            "query": `SELECT SQ.period_start as period_start, count(*) AS count_in_period FROM (SELECT DISTINCT resource->'subject'->>'id' as subject_id, to_timestamp(floor((extract('epoch' from (location->'period'->>'start')::timestamp) / 86400)) * 86400) AS period_start FROM Encounter encounter_table CROSS JOIN LATERAL jsonb_array_elements(resource->'location') AS location JOIN (SELECT id FROM Location location_table CROSS JOIN LATERAL jsonb_array_elements(resource->'type') AS type CROSS JOIN LATERAL jsonb_array_elements(type->'coding') AS type_coding WHERE type_coding->>'code'='ICU' ) location_table CROSS JOIN LATERAL jsonb_array_elements(encounter_table.resource->'location') AS location_location ON location_location->'location'->>'id' = location_table.id WHERE location -> 'period'->>'start'>='${fromDate}' AND location->'period'->>'start'<'${toDate}') SQ GROUP BY period_start`
        }
        return this;
    }

    breakdownPerDay(type: string, field: string, minDate: Date, maxDate: Date): SRSBld {
        this.selector.breakdown = {
            "resource": {
                "type": type,
                "field": field
            },
            "slices": {
                "step": 24 * 60 * 60 /* Number of seconds in a day */,
                "min": format(minDate, "yyyy-MM-dd"),
                "max": format(maxDate, "yyyy-MM-dd")
            }
        }
        return this;
    }
}

export class SRBuilder {
    static newReq(): SRBld { return new SRBld(); }
    static newSel(resourceId: string): SRSBld { return new SRSBld(resourceId); }
}
