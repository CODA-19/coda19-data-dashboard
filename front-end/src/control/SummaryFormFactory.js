import { sortBy } from "underscore";

const secondsPerDay = 24 * 60 * 60;

function qbRuleToFilter(rule) {
    const { id, operator, value } = rule;

    // FIXME(malavv): All of this is super temporary.
    if (id === "deceasedBoolean" && operator === "equal") {
        return { "path": "deceasedBoolean", "operator": "is", "value": value === 0 ? "false" : "true" }
    }
    if (id === "deceasedDateTime" && operator === "is_not_null") {
        return { "path": "deceasedDateTime", "operator": "isNot", "value": "null" }
    }

    console.warn("Unknown rule, need to be managed.");
    return rule;
}

function qbBreakdown(cfg) {
    return {
        "resource": { "type": cfg.resourceType, "field": cfg.resourceAttribute },
        "slices": { "step": Number.parseInt(cfg.period.step) * secondsPerDay, "min": cfg.period.start, "max": cfg.period.end }
    }
}

export default class SummaryFormFactory {
    static fromForm(dat, brkdwn) {

        const selector = {
            "resource": "Patient",
            "filters": dat.query.rules.map(qbRuleToFilter),
            "fields": sortBy(dat.field.map(el => ({ path: el.value })), 'path')
        };

        if (brkdwn && dat.breakdown.resourceType !== "") {
            selector['breakdown'] = qbBreakdown(dat.breakdown)
        }

        return {
            "selectors": [ selector ],
            "options": {
                "measures": {
                    "continuous": dat.measures.cont.map(el => el.value),
                    "categorical": dat.measures.disc.map(el => el.value)
                }
            }
        };
    }
}

