import {Application, Request} from 'express';
import {
    SummarizeRequestBody,
    SummarizeRequestSelectorFilter
} from "../../coda19-ts/src/request/SummarizeRequest";
import{ format, addDays } from 'date-fns';
import {Sites} from "./Sites";

const fromThisDate = new Date("2021/04/05");
const onlyCountOptions = { measures: { continuous: [], categorical: ["count"] } };
const breakdownPerDay = {
    "resource": { "type": "Observation", "field": "issued" },
    "slices": { "step": 86400 /* in sec or 1 day */ }
};

/**
 * Creates an "is" operator filter.
 * @param path Field path
 * @param value Is value
 * @returns 
 */
function FilterIs(path: string, value: string) : SummarizeRequestSelectorFilter {
    return { path: path, operator: "is", value: value };
}

type DataFilterType = "afterOrOn" | "before";

/**
 * Creates a AfterOrOn Date filter.
 * @param path Field path
 * @param type Type of date filter
 * @param date Date as a string, YYYY-MM-DD
 * @returns 
 */
function FilterDate(path: string, type: DataFilterType, date: string) : SummarizeRequestSelectorFilter {
    return { path: path, operator: type, value: date };
}

const preMadeReq: {[id: string] : SummarizeRequestBody }   = {
    'p4': {
        selectors: [
            {
                resource: "Observation",
                filters: [
                    FilterIs("code.coding.display", "positive"),
                    FilterDate("issued", "afterOrOn", format(new Date(2021, 1,1), "yyyy-MM-dd")),
                    FilterDate("issued", "before", format(addDays(fromThisDate, 1), "yyyy-MM-dd"))
                ],
                "fields": [],
                "breakdown": breakdownPerDay
            }
        ],
        options: onlyCountOptions
    },
    'p5': {
        selectors: [
            {
                resource: "Observation",
                filters: [
                    FilterDate("issued", "afterOrOn", format(new Date(2021, 1,1), "yyyy-MM-dd")),
                    FilterDate("issued", "before", format(addDays(fromThisDate, 1), "yyyy-MM-dd"))
                ],
                "fields": [],
                "breakdown": breakdownPerDay
            }
        ],
        options: onlyCountOptions
    }
}

export type PerSiteNumber = {[site: string]:number};

function siteMapper(siteCode: string): string {
    switch (siteCode) {
        case '115': return 'CHUM';
        case '110': return 'CHUQ';
        case 'all': return 'ALL';
        default: return 'UNIMPLEMENTED';
    }
}

export class DashPanels {
    mock: {[panel: string]:Object};
    app: Application;
    sitesProxy: Sites;

    constructor(mock: {[panel: string]:Object}, app: Application, req: Request) {
        this.mock = mock;
        this.app = app;
        this.sitesProxy = new Sites(req);
    }

    private getCache(key: string): any { return this.app.get(key); }
    private setCache(key: string, data: any) { this.app.set(key, data); }

    public getPanelViewModel(panelId: string) : Promise<any> {
        const cached = this.getCache(panelId);
        if (cached !== undefined)
            return Promise.resolve(cached);

        switch (panelId) {
            // Line 1
            case 'p1': return this.computePanel1().then(res => { this.setCache(panelId, res); return res; })
            case 'p2': return this.computePanel2().then(res => { this.setCache(panelId, res); return res; });
            case 'p3': return this.computePanel3().then(res => { this.setCache(panelId, res); return res; });
            // line 3
            case 'p7': return this.computePanel7().then(res => { this.setCache(panelId, res); return res; });
            //case 'p8': return this.computePanel8(req); // Currently no hub data
            //case 'p9': return this.computePanel9(req); // Currently no hub data
            default:
                return Promise.resolve(this.mock[panelId]); // Ensure mock data for the moment.
                //return Promise.reject(new Error("Unimplemented panel"));
        }
    }

    private async computePanel1() : Promise<any> {
        return this.sitesProxy.getCohortSizeOnDate(fromThisDate, ["115"])
            .then((numberInCohort: number) => ({
                "total_count": numberInCohort, // Total number of "participants" in our cohort at this date.
                "prevalence": 0.04 // fraction of the cohort that is COVID-19 positive
            }));
    }

    private async computePanel2() : Promise<any> {
        return this.sitesProxy.getNewCasesOnDate(fromThisDate, ["115"])
            .then((newPosOnDate: number) => ({
                "date": format(fromThisDate, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newPosOnDate, // Count of Patient with COVID+ tests on this day.
                "sma_7d": 943, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 0.92 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel3() : Promise<any> {
        return this.sitesProxy.getNewCaseFatalityOnDate(fromThisDate, ["115"])
            .then((newDeathsOnDate: number) => ({
                "date": format(fromThisDate, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newDeathsOnDate, // Number of new members of this cohort that were COVID-19 positive and died
                "sma_7d": 11, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 0.86 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel7() : Promise<any> {
        // FIXME(malavv) : This is *NOT* what panel 7 should be, but since I can't get a date with ongoing ICU for both (the two dates are chosen to emulate the correct date).
        const sites2count: Map<string, number> = await this.sitesProxy.getIcuBetween(new Date("2021/03/01"), new Date("2021/03/08"), ["110", "115"]);

        let res: {[key: string]: number} = {};
        sites2count.forEach((val: number, key: string) => { res[siteMapper(key)] = val; });

        return Promise.resolve({
            "sites" : res
        });
    }
}

