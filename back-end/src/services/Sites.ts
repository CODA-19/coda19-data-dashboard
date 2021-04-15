import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import {Request} from 'express';
import {SiteInfoRequest} from "../../coda19-ts/src/request/SiteInfoRequest";
import {SRBuilder} from "../model/SummarizeRequestBuilder";
import {addDays} from 'date-fns';
import {I18nString} from "../../coda19-ts/src/base";
import {
    SummarizeRequestBody, SummarizeRequestBreakdownSliceResult,
    SummarizeRequestResult,
    SummarizeRequestSiteAllResult, SummarizeRequestSiteResult
} from "../../coda19-ts/src/request/SummarizeRequest";
import {PerSiteNumber} from "./DashPanels";
import Terms from "../../coda19-ts/src/term/term";

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
        case '114':
            return 'CIUSSS-NIM';
        case '110':
            return 'CHUM';
        case '115':
            return 'CHUQ-UL';
        case '116':
            return 'CISSS-CA';
        case '112':
            return 'JGH';
        case 'all':
            return 'all';

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
    return new Map(res.map((s: SummarizeRequestSiteAllResult) => [code2name(s[0].siteCode), s[0].total]));
}

export type PeriodBreakdownPerSite = { dates: Date[], sites: {[site: string]: number[]} };

function getPeriodBreakdownPerSite(res: SummarizeRequestResult): PeriodBreakdownPerSite {
    // Get first result for each site
    const firstResults: SummarizeRequestSiteResult[] = res.map((arr: SummarizeRequestSiteResult[]) => arr[0]);
    // Remove all, for some reason, all is not property computed.
    const sitesDf: SummarizeRequestSiteResult[] = firstResults.filter((site: SummarizeRequestSiteResult) => site.siteCode !== 'all');
    // Get dates from first result. (Note this will probably be flaky if not all sites have the same data.)
    const dates = sitesDf[0].breakdown.result.map((rec: SummarizeRequestBreakdownSliceResult) => new Date(rec.periodStart));

    // Load site data
    const sites: {[site:string]: number[]} = {};
    for (let site of sitesDf) {
        sites[code2name(site.siteCode)] = site.breakdown.result.map((rec: SummarizeRequestBreakdownSliceResult) => rec.periodCount);
    }

    // Nice packaging
    return {
        dates: dates,
        sites: sites
    };
}

/**
 * Extract the aggregated sites value.
 * @param sites2total Totals per site.
 */
function getAllTotal(sites2total: Map<string, number>): Promise<number> {
    if (sites2total.has("all"))
        return Promise.resolve(sites2total.get("all") ?? -1);
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
                .filterIs("code.coding.code", Terms.LOINC.SarsCov2Probe.code)
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
            .filterIs("code.coding.code", Terms.LOINC.SarsCov2Probe.code)
            .filterIs("interpretation.coding.display", Terms.LOINC.Positive.code)
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

    getActiveIcuOnDate(date: Date, sitesCode?: string[]): Promise<Map<string, number>> {
        // Active ICU Hospitalizations on Date
        const icuCountPerSitesBetweenDates = SRBuilder.newSel("Encounter")
            .filterIs("location.location.display", "intensive_care_unit")
            .filterDateOn("location.period.start", date)
            .join(SRBuilder.newSel("Location")
                .filterIs("type.coding.code", "ICU"))

        // Building summary request
        const sr = SRBuilder.newReq()
            .addSelector(icuCountPerSitesBetweenDates)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCode)
            .then(getSites2Total);
    }

    getNewDailyPosPerSiteBetween(from: Date, to: Date, sitesCodes?: string[]) {
        const newPosPerSitePerDayUpTo = SRBuilder.newSel("Observation")
            .filterIs("code.coding.code", Terms.LOINC.SarsCov2Probe.code)
            .filterIs("interpretation.coding.display", Terms.LOINC.Positive.code)
            .filterDateAfterOrOn("issued", from)
            .filterDateBefore("issued", to)
            .breakdownPerDay("Observation", "issued");

        const sr = SRBuilder.newReq()
            .addSelector(newPosPerSitePerDayUpTo)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getPeriodBreakdownPerSite);
    }

    getNewDailyTestsPerSiteBetween(from: Date, to: Date, sitesCodes?: string[]) {
        const newTestsPerSitePerDayUpTo = SRBuilder.newSel("Observation")
            .filterIs("code.coding.code", Terms.LOINC.SarsCov2Probe.code)
            .filterDateAfterOrOn("issued", from)
            .filterDateBefore("issued", to)
            .breakdownPerDay("Observation", "issued");

        const sr = SRBuilder.newReq()
            .addSelector(newTestsPerSitePerDayUpTo)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getPeriodBreakdownPerSite);
    }

    getNewDailyIcuPerSiteBetween(from: Date, to: Date, sitesCodes?: string[]) {
        const icuCountPerSitesBetweenDates = SRBuilder.newSel("Encounter")
            .addTEMPORARYIcuBreakdown();

        const sr = SRBuilder.newReq()
            .addSelector(icuCountPerSitesBetweenDates)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getPeriodBreakdownPerSite);
    }

    getNewDailyWardPerSiteBetween(from: Date, to: Date, sitesCodes?: string[]) {
        const wardCountPerSitesBetweenDates = SRBuilder.newSel("Encounter")
            .addTEMPORARYWardBreakdown();

        const sr = SRBuilder.newReq()
            .addSelector(wardCountPerSitesBetweenDates)
            .addMeasures({categorical: ["count"]})
            .build();

        // Get summary results.
        return this.doSummaryQuery(sr, sitesCodes)
            .then(getPeriodBreakdownPerSite);
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
