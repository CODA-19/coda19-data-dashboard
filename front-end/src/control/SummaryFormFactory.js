import { sortBy } from "underscore";

import {
  ResourceTypes,
  FiltersByDataType,
  AttributesByResourceType,
} from "@CODA-19/coda19-fhir-templates";

console.log(ResourceTypes, FiltersByDataType, AttributesByResourceType);
const secondsPerDay = 24 * 60 * 60;

function qbRuleToFilter(rule) {
  const { id, operator, value } = rule;

  return {
    path: id,
    operator: operator,
    value: value
  }

}

function qbBreakdown(cfg) {
  const fd =
    cfg.resourceAttribute === "deceasedDateTime"
      ? "deceased.dateTime"
      : cfg.resourceAttribute;
  return {
    resource: { type: cfg.resourceType, field: fd },
    slices: {
      step: Number.parseInt(cfg.period.step) * secondsPerDay,
      min: cfg.period.start,
      max: cfg.period.end,
    },
  };
}

export default class SummaryFormFactory {
  static fromForm(dat, brkdwn) {
    var selector = {
      resource: dat.qB[0].name,
      filters: dat.qB[0].query.rules.map(rule => qbRuleToFilter(rule)),
      fields: sortBy(
        dat.field.map((el) => ({ path: el.value })),
        "path"
      ),
    };
    if(dat.qB[1]){ //temp for single join. limited by the querybuilder module in statsAPI
      const joinSelector = {
        resource: dat.qB[1].name,
        filters: dat.qB[1].query.rules.map(rule => qbRuleToFilter(rule))
      };
      selector["joins"] = joinSelector;
    }
    if (brkdwn && dat.breakdown.resourceType !== "") {
      selector["breakdown"] = qbBreakdown(dat.breakdown);
    }
    return {
      selectors: [selector],
      options: {
        measures: {
          continuous: dat.measures.cont.map((el) => el.value),
          categorical: dat.measures.disc.map((el) => el.value),
        },
      },
    };
  }
}
