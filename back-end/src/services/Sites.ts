import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import {Request} from 'express';
import {SiteInfoRequest} from "../../coda19-ts/src/request/SiteInfoRequest";
import {SRBuilder} from "../model/SummarizeRequestBuilder";
import {addDays} from 'date-fns';
import {I18nString} from "../../coda19-ts/src/base";
import {
    SummarizeRequestBody,
    SummarizeRequestResult,
    SummarizeRequestSiteAllResult
} from "../../coda19-ts/src/request/SummarizeRequest";

// FIXME(malavv): The names should come from each sites, not being faked here.
function convertMock2Name(pkg: any) {
    let conn = pkg["connections"];
    let api = pkg["api_version"];

    let res = [];
    for (let c of conn) {
        let {fr, en} = localizedNameFromCode(c.uid);
        c["name"] = en;
        c["names"] = {"fr": fr, "en": en};
        res.push(c);
    }

    return {
        "connections": conn,
        "api_version": api
    };
}

// FIXME(malavv): The names should come from each sites, not being faked here.
function localizedNameFromCode(code: string): I18nString {
    const txt = code2name(code);
    return {"fr": `Hôpital ${txt}`, "en": `${txt} Hospital`}
}

// FIXME(malavv): The names should come from each sites, not being faked here.
function code2name(code: string): string {
    switch (code) {
        case '103':
        case '102':
            return 'VALERIA';

        case '110':
            return 'CHUM';
        case '115':
            return 'CHUQ-UL';
        case '116':
            return 'CISSS-CA';
        case '112':
            return 'JGH';

        default:
            return 'Unknown';
    }
}

/**
 * Read Response data as a Summary Request Result
 * @param res Response Data
 */
function getSRData(res: any): SummarizeRequestResult {
    return res.data;
}

/**
 * Extract the total for all sites, into a map by site code.
 * @param res Summary Request Result
 */
function getSites2Total(res: SummarizeRequestResult): Map<string, number> {
    return new Map(res.map((s: SummarizeRequestSiteAllResult) => [s[0].siteCode, s[0].total]));
}

/**
 * Extract the aggregated sites value.
 * @param sites2total Totals per site.
 */
function getAllTotal(sites2total: Map<string, number>): Promise<number> {
    if (sites2total.has("all"))
        return Promise.resolve(sites2total.get("all") || -1);
    else
        return Promise.reject("No Aggregated all value");
}

/**
 * Facade structure to site resources.
 *
 * Goal is to focus on what you want, and not on how to get it.
 */
export class Sites {
    private readonly req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    /**
     * List of sites connected and their resources.
     *
     * Only information available at startup on these sites will be available through this request.
     */
    listConnected(): Promise<SiteInfoRequest> {
        return axios.get('/info', passAuth(this.req))
            .then((res: any) => res.data)
            .then(convertMock2Name);
    }

    /**
     * Panel 1 main source of information.
     * @param date Count all up to this date (included)
     * @param sitesCodes Sites to query.
     */
    getCohortSizeOnDate(date: Date, sitesCodes?: string[]): Promise<number> {
        // SARS-COV-2 observation present with any value, before given date
        const patientWithTestBeforeDate = SRBuilder.newSel("Patient").join(
            SRBuilder.newSel("Observation")
                .filterDateBefore("effectiveDateTime", addDays(date, 1)));

        // Building summary request
        const sr = SRBuilder.newReq()
            .addSelector(patientWithTestBeforeDate)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getSites2Total)
            .then(getAllTotal);
    }

    getNewCasesOnDate(date: Date, sitesCodes?: string[]): Promise<number> {
        // SARS-COV-2 observation present with Pos value, on a given date
        const posTestOnDate = SRBuilder.newSel("Observation")
            .filterIs("code.coding.display", "positive")
            .filterDateOn("effectiveDateTime", date);

        // Building summary request
        const sr = SRBuilder.newReq()
            .addSelector(posTestOnDate)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getSites2Total)
            .then(getAllTotal);
    }

    getNewCaseFatalityOnDate(date: Date, sitesCodes?: string[]): Promise<number> {
        // COVID+ patients deaths on given date
        const deathsFromPosOnDate = SRBuilder.newSel("Patient")
            .filterIs("deceasedBoolean", "true")
            .filterDateOn("deceasedDateTime", date);

        // Building summary request
        const sr = SRBuilder.newReq()
            .addSelector(deathsFromPosOnDate)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getSites2Total)
            .then(getAllTotal);
    }

    private doSummaryQuery(request: SummarizeRequestBody, sitesCodes?: string[]): Promise<SummarizeRequestResult> {
        if (sitesCodes === undefined || !Array.isArray(sitesCodes))
            return Promise.reject(new Error("Invalid sites"));

        // Package request and auth headers.
        const reqCfg = {...{data: request}, ...passAuth(this.req)};

        // Get summary results.
        return axios.get(`/stats/summarize?sites=${sitesCodes.join(',')}`, reqCfg)
            .then(getSRData);
    }
}
