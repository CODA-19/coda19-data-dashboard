import { sortBy } from "underscore";

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
    const selectorLength = dat.qB.length;
      var selector = {
        resource: dat.qB[0].name,
        label: dat.qB[0].name + '0',
        filters: dat.qB[0].query.rules.map(rule => qbRuleToFilter(rule)),
        fields: sortBy(
          dat.qB[0].field.map((el) => ({ path: el,  label:dat.qB[0].name+"_"+el})),
          "path"
        ),
      };
    if(dat.qB[1]){
    selector = this.recursiveAppendJoins(selectorLength, 1, dat.qB, selector)
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

  static recursiveAppendJoins(selectorLength, currentSelector, form, selector){
    if(!currentSelector < selectorLength-1){
      const joinSelector = {
        resource: form[currentSelector].name,
        label: form[currentSelector].name + currentSelector,
        filters: form[currentSelector].query.rules.map(rule => qbRuleToFilter(rule)),
        fields: sortBy(
          form[currentSelector].field.map((el) => ({ path: el ,  label:form[currentSelector].name+"_"+el})),
          "path"
        ),
      };
      selector["joins"] = joinSelector;
      return selector
    }
    else {
      const joinSelector = {
        resource: form[currentSelector].name,
        label: form[currentSelector].name + currentSelector,
        filters: form[currentSelector].query.rules.map(rule => qbRuleToFilter(rule)),
        fields: sortBy(
          form[currentSelector].field.map((el) => ({ path: el ,  label:form[currentSelector].name+"_"+el})),
          "path"
        ),
      };
      selector["joins"] = joinSelector;
      return this.recursiveAppendJoins(selectorLength, currentSelector++, form, selector)
    }
  }
}
