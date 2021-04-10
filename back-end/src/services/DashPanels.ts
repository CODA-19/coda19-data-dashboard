import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import {Application, Request, Response} from 'express';
import {
    SummarizeRequestBody,
    SummarizeRequestSelectorFilter
} from "../../coda19-ts/src/request/SummarizeRequest";
import{ format, addDays } from 'date-fns';
import {Sites} from "./Sites";

const fromThisDate = new Date(2021, 4, 5);
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
    'p1': {
        selectors: [
            { 
                resource: "Patient", 
                filters: [], 
                fields: [], 
                joins: { 
                    resource: "Observation", 
                    filters: [FilterDate("effectiveDateTime", "before", format(addDays(fromThisDate, 1), "yyyy-MM-dd"))],
                    fields: [] 
                } 
            }
        ],
        options: onlyCountOptions
    },
    'p2': {
        selectors: [ 
            { 
                resource: "Observation", 
                filters: [ 
                    FilterIs("code.coding.display", "positive"),
                    FilterDate("effectiveDateTime", "afterOrOn", format(fromThisDate, "yyyy-MM-dd")),
                    FilterDate("effectiveDateTime", "before", format(addDays(fromThisDate, 1), "yyyy-MM-dd"))
                ], 
                fields: [] 
            } 
        ],
        options: onlyCountOptions
    },
    'p3': {
        selectors: [
            {
                resource: "Patient",
                filters: [ 
                    FilterIs("deceasedBoolean", "true"),
                    FilterDate("deceasedDateTime", "afterOrOn", format(fromThisDate, "yyyy-MM-dd")),
                    FilterDate("deceasedDateTime", "before", format(addDays(fromThisDate, 1), "yyyy-MM-dd"))
                ],
                fields: [ {"path": "gender" } ]
            }
        ],
        options: onlyCountOptions
    },
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
    },
    'p7': {
        selectors: [{
            resource: "Encounter",
            filters: [ FilterIs("location.location.display", "intensive_care_unit"), FilterDate("location.period.start", "afterOrOn", "2021-03-01") ],
            fields: []
        }],
        options: onlyCountOptions
    }
}

export type PerSiteNumber = {[site: string]:number};

// Incomplete and for latter, I don't have time to make pretty interface before demo.
export interface DashCalculator {
    getCohortSize(): Promise<number>;
    getCovidPosFrom(date: Date): Promise<number>;
    getCaseFatalityFrom(date: Date): Promise<number>;
    getPrevalence(): Promise<number>;
    getCaseFatality(): Promise<PerSiteNumber>;
    getIcuOccupancy(): Promise<PerSiteNumber>;
    getOccupation(): Promise<number>;
}

function deepCloneHack(obj: Object): Object {
    return JSON.parse(JSON.stringify(obj));
}

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

    private static getSummarizeUrl(sites: string[]) {
        return '/stats/summarize?sites=' + sites.join(',');
    }

    public getRequest(panelId: string) {
        const reqCfg = preMadeReq[panelId];

        // FIXME(malavv): this is not meant to be permanent. All sites should be asked.
        let reqSites = parseInt(panelId.substr(1)) < 4 ? ['115']: ['115', '110'];

        return (req: Request) => {
            return reqCfg
                ? axios.get(DashPanels.getSummarizeUrl(reqSites), {...{data: reqCfg}, ...passAuth(req)}).then((res:Response) => res)
                : Promise.reject(new Error("Not Implemented"));
        }
    }

    public getPanelViewModel(panelId: string, req: Request) : Promise<any> {
        const cached = this.getCache(panelId);
        if (cached !== undefined)
            return Promise.resolve(cached);

        switch (panelId) {
            // Line 1
            case 'p1': return this.computePanel1().then(res => { this.setCache(panelId, res); return res; })
            case 'p2': return this.computePanel2(req).then(res => { this.setCache(panelId, res); return res; });
            case 'p3': return this.computePanel3(req).then(res => { this.setCache(panelId, res); return res; });
            // line 3
            case 'p7': return this.computePanel7(req).then(res => { this.setCache(panelId, res); return res; });
            //case 'p8': return this.computePanel8(req); // Currently no hub data
            //case 'p9': return this.computePanel9(req); // Currently no hub data
            default:
                return Promise.resolve(this.mock[panelId]); // Ensure mock data for the moment.
                //return Promise.reject(new Error("Unimplemented panel"));
        }
    }

    private async computePanel1() : Promise<any> {
        return this.sitesProxy.getCohortSizeAtDate(fromThisDate, ["115"])
            .then((numberInCohort: number) => ({
                "total_count": numberInCohort, // Total number of "participants" in our cohort at this date.
                "prevalence": 0.04 // fraction of the cohort that is COVID-19 positive
            }));
    }

    private async computePanel2(req: Request) : Promise<any> {
        let p2Data: any = deepCloneHack(this.mock['p2']);
        let res = await this.getRequest("p2")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));

        p2Data["date"] = format(fromThisDate, "yyyy-MM-dd");
        p2Data["new_cases"] = totalCounts.get('all');
        return Promise.resolve(p2Data);
    }

    private async computePanel3(req: Request) : Promise<any> {
        let p3Data: any = deepCloneHack(this.mock['p3']);
        let res = await this.getRequest("p3")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));

        p3Data["date"] = format(fromThisDate, "yyyy-MM-dd");
        p3Data["new_cases"] = totalCounts.get('all');
        return Promise.resolve(p3Data);
    }

    private async computePanel7(req: Request) : Promise<any> {
        let p7Data: any = deepCloneHack(this.mock['p7']);
        let res = await this.getRequest("p7")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));

        let sites: any = {};
        totalCounts.forEach((value: number, key: string) => { sites[siteMapper(key)] = value; });
        p7Data["sites"] = sites;
        return Promise.resolve(p7Data);
    }

    private computePanel8(req: Request) : Promise<any> {
        return Promise.resolve(undefined);
    }

    private computePanel9(req: Request) : Promise<any> {
        return Promise.resolve(undefined);
    }
}

