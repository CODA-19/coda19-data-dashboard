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
    var allSelectors = []
    for(var index=0; index < selectorLength; index++){
      var selector = {
        resource: dat.qB[index].name,
        label: dat.qB[index].label,
        filters: dat.qB[index].query.rules.map(rule => qbRuleToFilter(rule)),
        fields: 
          dat.qB[index].field.map((el) => 
          {return { path: el.path,  label:dat.qB[index].label+"_"+el.path, type: el.type}}),
      };
      allSelectors.push(selector);
    }

    var queryBody = {
      selectors: allSelectors,
      options: {
        measures: {
          continuous: dat.measures.cont.map((el) => el.value),
          categorical: dat.measures.disc.map((el) => el.value),
        }
      }
    }

    if(brkdwn) {
      queryBody.options.breakdown = selectorBreakdown;
    }
    
    return queryBody
  }
}
