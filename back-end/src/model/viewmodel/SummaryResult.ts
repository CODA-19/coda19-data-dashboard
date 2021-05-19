import {SummarizeRequestBody} from "../../../coda19-ts/src/request/SummarizeRequest";
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
    const fields = req.selectors[0].fields.map(f => typeof f === "string" ? f : f.path);

    let res = [];
    for (let field of fields) {
        let tmp = null;
        // FIXME(malavv): this is not permanent and shouldn't be. It allows what is in the demo (the 2 tasks)
        if (field === "gender") {
            let categories = ["female", "male", "unknown"];
            let dat = obj.map((o:any) => o[0]).map((siteDat:any) => {
                let result = siteDat.results.filter((f: any) => f.field === field)[0];
                let counts = new Map(result.count.map((d:any) => [d.label, d.value]));
                return [
                    Sites.convertCode2Name(siteDat.siteCode),
                    siteDat.total,
                    result.mode,
                    categories.map(c => counts.has(c) ? counts.get(c): 0)
                ];
            });

            tmp = {
                "about": { "field": field },
                "cols": [
                    { "code": "site", "labels": customLabels("site") },
                    { "code": "total", "labels": customLabels("total") },
                    { "code": "mode", "labels": customLabels("mode") },
                    { "code": "count", "labels": customLabels("count"), "categories": categories.map(c => ({"code": c})) }
                ],
                "data": dat
            };
            res.push(tmp);
        } else if (field === "age") {

            let dat = obj.map((o:any) => o[0]).map((siteDat:any) => {
                const siteName = Sites.convertCode2Name(siteDat.siteCode);
                let result = siteDat.results.filter((f: any) => f.field === field)[0];
                if (siteName === "all") {
                    return [
                        Sites.convertCode2Name(siteDat.siteCode),
                        418492,
                        result.mean,
                        result.stdev,
                        result.ci95
                    ];
                } else {
                    return [
                        Sites.convertCode2Name(siteDat.siteCode),
                        result.mean.populationSize,
                        result.mean.mean,
                        result.stdev,
                        result.ci95
                    ];
                }

            });

            tmp = {
                "about": { "field": "age" },
                "cols": [
                    { "code": "site", "labels": { "fr": "site", "en": "site" } },
                    { "code": "total", "labels": { "fr": "total", "en": "total" } },
                    { "code": "mean", "labels": { "fr": "moyenne", "en": "mean" } },
                    { "code": "stdev", "labels": { "fr": "stdev", "en": "stdev" } },
                    { "code": "ci95", "labels": { "fr": "ic95", "en": "ci95" }, "categories": [ {"code": "lower"}, {"code": "upper"}] }
                ],
                "data": dat
            };
            res.push(tmp);
        } else {
            console.warn("unimplemented");
        }
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