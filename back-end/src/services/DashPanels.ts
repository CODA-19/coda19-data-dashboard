import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import {Application, Request, Response} from 'express';
import {
    SummarizeRequestBody,
    SummarizeRequestSelector,
    SummarizeRequestSelectorFilter
} from "../../coda19-ts/src/request/SummarizeRequest";
import fs from "fs";
import JSON5 from 'json5';

const sites = ['115'];

const onlyCountOptions = {
    measures: {
        continuous: [],
        categorical: ["count"]
    }
};
const covidPosFilter: SummarizeRequestSelectorFilter = {
    path: "code.coding.display",
    operator: "is",
    value: "positive"
};
const afterDateFilter: SummarizeRequestSelectorFilter = {
    path: "effectiveDateTime",
    operator: "afterOrOn",
    value: "2021-03-31"
};
const isDeadFilter: SummarizeRequestSelectorFilter = {
    "path": "deceasedBoolean",
    "operator": "is",
    "value": "true"
};
const isDeadAfterDateFilter: SummarizeRequestSelectorFilter = {
    "path": "deceasedDateTime",
    "operator": "afterOrOn",
    "value": "2021-03-31"
};
const inICUFilter: SummarizeRequestSelectorFilter = {
    "path": "location.location.display",
    "operator": "is",
    "value": "intensive_care_unit"
};
const afterDate: SummarizeRequestSelectorFilter = {
    "path": "location.period.start",
    "operator": "afterOrOn",
    "value": "2021-03-01"
};

const covidPosObservations: SummarizeRequestSelector = {
    resource: "Observation",
    filters: [covidPosFilter],
    fields: []
};

const preMadeReq: {[id: string] : SummarizeRequestBody }   = {
    'p1': {
        selectors: [{ resource: "Patient", filters: [], fields: [], joins: covidPosObservations }],
        options: onlyCountOptions
    },
    'p2': {
        selectors: [ { resource: "Observation", filters: [ covidPosFilter, afterDateFilter ], fields: [] } ],
        options: onlyCountOptions
    },
    'p3': {
        selectors: [
            {
                "resource": "Patient",
                "filters": [ isDeadFilter, isDeadAfterDateFilter ],
                "fields": [
                    {"path": "gender" }
                ]
            }
        ],
        options: onlyCountOptions
    },
    'p7': {
        selectors: [{
            resource: "Encounter",
            filters: [ inICUFilter, afterDate ],
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

    constructor(mock: {[panel: string]:Object}, app: Application) {
        this.mock = mock;
        this.app = app;
    }

    private getCache(key: string): any { return this.app.get(key); }
    private setCache(key: string, data: any) { this.app.set(key, data); }

    private static getSummarizeUrl(sites: string[]) {
        return '/stats/summarize?sites=' + sites.join(',');
    }

    public getRequest(panelId: string) {
        const reqCfg = preMadeReq[panelId];

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
            case 'p1': return this.computePanel1(req).then(res => { this.setCache(panelId, res); return res; })
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

    private async computePanel1(req: Request) : Promise<any> {
        let p1Data: any = deepCloneHack(this.mock['p1']);
        let res = await this.getRequest("p1")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));
        p1Data["total_count"] = totalCounts.get('all');
        return Promise.resolve(p1Data);
    }

    private async computePanel2(req: Request) : Promise<any> {
        let p2Data: any = deepCloneHack(this.mock['p2']);
        let res = await this.getRequest("p2")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));

        p2Data["date"] = afterDateFilter.value;
        p2Data["new_cases"] = totalCounts.get('all');
        return Promise.resolve(p2Data);
    }

    private async computePanel3(req: Request) : Promise<any> {
        let p3Data: any = deepCloneHack(this.mock['p3']);
        let res = await this.getRequest("p3")(req);

        let totalCounts : Map<string, number> = new Map(res.data.map((s:any) => [s[0].siteCode, s[0].total]));

        p3Data["date"] = isDeadAfterDateFilter.value;
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

