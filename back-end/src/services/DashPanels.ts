import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import { Request, Response } from 'express';
import {
    SummarizeRequestBody,
    SummarizeRequestSelector,
    SummarizeRequestSelectorFilter
} from "../../coda19-ts/src/request/SummarizeRequest";

const sites = ['115'];

const onlyCountOptions = {
    measures: {
        continuous: [],
        categorical: ["count"]
    }
};
const covidPosFilter: SummarizeRequestSelectorFilter = {
    path: "interpretation.coding.display",
    operator: "is",
    value: "positive"
};
const afterDateFilter: SummarizeRequestSelectorFilter = {
    path: "effectiveDateTime",
    operator: "afterOrOn",
    value: "2021-03-25"
};
const isDeadFilter: SummarizeRequestSelectorFilter = {
    "path": "deceasedBoolean",
    "operator": "is",
    "value": "true"
};
const isDeadAfterDateFilter: SummarizeRequestSelectorFilter = {
    "path": "deceasedDateTime",
    "operator": "afterOrOn",
    "value": "2021-03-25"
};
const inICUFilter: SummarizeRequestSelectorFilter = {
    "path": "location.location.display",
    "operator": "is",
    "value": "intensive_care_unit"
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
            filters: [ inICUFilter ],
            fields: []
        }],
        options: onlyCountOptions
    }
}

export class DashPanels {
    private static getSummarizeUrl(sites: string[]) {
        return '/stats/summarize?sites=' + sites.join(',');
    }

    public getRequest(panelId: string) {
        const reqCfg = preMadeReq[panelId];
        return (req: Request) => {
            return reqCfg
                ? axios.get(DashPanels.getSummarizeUrl(sites), {...{data: reqCfg}, ...passAuth(req)}).then((res:Response) => res)
                : Promise.reject(new Error("Not Implemented"));
        }
    }
}

