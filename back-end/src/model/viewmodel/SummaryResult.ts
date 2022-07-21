import {SummarizeRequestBody, SummarizeRequestField, SummarizeRequestSelector} from "../../../coda19-ts/src/request/SummarizeRequest";
import {I18nString} from "../../../coda19-ts/src/base";
import {Sites} from "../../services/Sites";

interface ClientSummaryResult {
    request: SummarizeRequestBody;
    data: any;
}

function dataFromBreakdown(req:SummarizeRequestBody, obj: any) {
    const breakResult = obj[0][0].breakdown.result;

    let dat = obj.map((o:any) => o[0]).map((siteDat: any) => {
        return [
            Sites.convertCode2Name(siteDat.siteCode),
            siteDat.total,
            siteDat.breakdown.result.map((p:any) => p.periodCount),
        ];
    });

    return [
        {
            "about": { "field": "deceasedDateTime" },
            "cols": [
                { "code": "site", "labels": { "fr": "site", "en": "site" } },
                { "code": "total", "labels": { "fr": "total", "en": "total" } },
                {
                    "code": "count",
                    "labels": customLabels("count"),
                    "categories": breakResult.map((r:any) => ({code: r.periodStart}))
                }
            ],
            "data": dat
        }
    ];
}
function dataFromFields(req:SummarizeRequestBody, obj: any) {
    let fields:any[] = []
    let res:any[] = [];

    fields = fieldsFromSelector(req.selectors[0], fields)

    for (let field of fields) {
        let tmp:any = null;

            let dat = obj.map((o:any) => o[0]).map((siteDat:any) => {
                
                let result = siteDat.results.filter((f: any) => f.field === field)[0];

                if(result.measure == "categorical"){

                    tmp = {
                        "about": { "field": field, "measure": result.measure },
                        "cols": [
                            { "code": "site", "labels": customLabels("site") },
                            { "code": "total", "labels": customLabels("total") },
                            { "code": "mode", "labels": customLabels("mode") },
                            { "code": "count", "labels": customLabels("count"), "categories": result.count.map((c: { label: any; }) => ({"code": c.label})) }
                        ]
                    };

                    let counts = result.count.map((d:any) =>  d.value);

                    return [
                        Sites.convertCode2Name(siteDat.siteCode),
                        siteDat.total,
                        result.mode,
                        counts
                    ];
                }
                else if(result.measure == "continuous"){

                    tmp = {
                        "about": { "field": field, "measure": result.measure },
                        "cols": [
                            { "code": "site", "labels": { "fr": "site", "en": "site" } },
                            { "code": "total", "labels": { "fr": "total", "en": "total" } },
                            { "code": "mean", "labels": { "fr": "moyenne", "en": "mean" } },
                            { "code": "stdev", "labels": { "fr": "stdev", "en": "stdev" } },
                            { "code": "ci95", "labels": { "fr": "ic95", "en": "ci95" }, "categories": [ {"code": "lower"}, {"code": "upper"}] }
                        ]
                    };

                    return [
                        Sites.convertCode2Name(siteDat.siteCode),
                        result.mean.populationSize,
                        result.mean.mean,
                        result.stdev,
                        result.ci95
                    ];
                } 
                else {
                    console.warn("unimplemented measure");
                }
            
            });
            tmp["data"] = dat
            res.push(tmp);    
        }
    return res;
}

function customLabels(code: string): I18nString {
    switch (code) {
        case 'site': return { "fr": "site", "en": "site" };
        case 'total': return { "fr": "total", "en": "total" };
        case 'mode': return { "fr": "mode", "en": "mode" };
        case 'count': return { "fr": "décompte", "en": "count" };
        default: throw new Error('unimplemented');
    }

}
function requestHasBreakdown(r: SummarizeRequestBody): boolean {
    return r.selectors[0].breakdown !== undefined;
}

export default class SummaryResult {
    static fromSummary(request: SummarizeRequestBody, obj: any) : ClientSummaryResult {
        // Eventually the two might be merged, but for the moment, I'm separating breakdown and field containing queries.
        return {
            request: request,
            data: requestHasBreakdown(request) ? dataFromBreakdown(request, obj): dataFromFields(request, obj)
        };
    }
}

function fieldsFromSelector(selector: SummarizeRequestSelector, fields: any[]) : SummarizeRequestField[] {
    if(selector.joins){
        fieldsFromSelector(selector.joins, fields)
    }
    for (let field of selector.fields){
        fields.push((field as any).path)
    }
    return fields
}