import { sortBy } from "underscore";

const secondsPerDay = 24 * 60 * 60;

function qbRuleToFilter(rule) {
  const { type, id, operator, value } = rule;

  return {
    type: type,
    path: id,
    operator: operator,
    value: value
  }

}

function qbBreakdown(cfg) {
  var pstep = Number.parseFloat(cfg.period.step);
  if(cfg.attributeType == "dateTime"){
    pstep = pstep * secondsPerDay;
  }
  return {
    resource: { type: cfg.resourceType, field: cfg.resourceAttribute , fieldType: cfg.attributeType},
    slices: {
      step: pstep,
      min: cfg.period.start,
      max: cfg.period.end,
    },
  };
}

function includeFieldforBreakdown(form) {
  const breakdownResource = form.breakdown.resourceType;
  const breakdownField = form.breakdown.resourceAttribute;
  const breakdownFieldType = form.breakdown.attributeType;

  const resourceIndex = form.qB.findIndex(f => f.name == breakdownResource)
  if(resourceIndex < 0){//no resource found corresponding to the breakdown -> add resource and field
    const resource = {
      name: breakdownResource,
      label: `${breakdownResource}_${++form.qB.length}`,
      query: {
        rules : []
      },
      field: [{
            path: breakdownField,
            type: breakdownFieldType
        }]
    }
    form.qB.push(resource)
  }
  else{//resource found
    const fieldIndex = form.qB[resourceIndex].field.findIndex(f => f.path == breakdownField);
    if(fieldIndex < 0){ //breakdown field not in resource field -> add field
      const field = {
        path: breakdownField,
        type: breakdownFieldType
      }
      form.qB[resourceIndex].field.push(field)
    }
    //else if fieldIndex > 0, do nothing
  }
}

export default class SummaryFormFactory {
  static fromForm(dat, brkdwn) {
    
    if (brkdwn && dat.breakdown.resourceType !== "") {
      var selectorBreakdown = qbBreakdown(dat.breakdown);
      includeFieldforBreakdown(dat);
    }

    const selectorLength = dat.qB.length;
    var selector = {
      resource: dat.qB[0].name,
      label: dat.qB[0].label,
      filters: dat.qB[0].query.rules.map(rule => qbRuleToFilter(rule)),
      fields: 
        dat.qB[0].field.map((el) => 
        {return { path: el.path,  label:dat.qB[0].label+"_"+el.path, type: el.type}}),
    };
    if(brkdwn) {
      selector["breakdown"] = selectorBreakdown;
    }
    if(dat.qB[1]){
      selector["joins"] = this.recursiveAppendJoins(selectorLength, 1, dat.qB, selector)
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

  static recursiveAppendJoins(selectorLength, currentSelector, form){
    if(currentSelector == selectorLength-1){
      const joinSelector = {
        resource: form[currentSelector].name,
        label: form[currentSelector].label,
        filters: form[currentSelector].query.rules.map(rule => qbRuleToFilter(rule)),
        fields:
          form[currentSelector].field.map((el) => 
          {return { path: el.path,  label:form[currentSelector].label+"_"+el.path, type: el.type}}),
      };
      // selector["joins"] = joinSelector;
      return joinSelector
    }
    else {
      const joinSelector = {
        resource: form[currentSelector].name,
        label: form[currentSelector].label,
        filters: form[currentSelector].query.rules.map(rule => qbRuleToFilter(rule)),
        fields: sortBy(
          form[currentSelector].field.map((el) => ({ path: el ,  label:form[currentSelector].name+"_"+el})),
          "path"
        ),
        joins: this.recursiveAppendJoins(selectorLength, ++currentSelector, form)
      };
      return joinSelector
    }
  }
}
