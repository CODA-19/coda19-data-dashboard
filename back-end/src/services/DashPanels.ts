import {Application, Request} from 'express';
import {format} from 'date-fns';
import {Sites} from "./Sites";
import {last, sortBy, zip} from 'underscore';
import {getCachedFile, getRandomInt, isSetsEquals, ObjectFromEntries} from "../helpers/poly";
import {resolveAfter} from "../helpers/promises";
import JSON5 from 'json5';

/** The request can be asked for real data "real", mocked data "mock", or mocked with added fake latency "lagmock" */
type QueryModeType = "real" | "mock" | "lagmock";
// Upper range for latency range in _lagmock_ in milliseconds.
const maxJitterMs = 2000;

export type PerSiteNumber = { [site: string]: number };

export class DashPanels {
    mock: { [panel: string]: Object };
    app: Application;
    sitesProxy: Sites;
    date: Date;
    sitesCode: string[];
    mode: QueryModeType;

    constructor(mockDataPath: string, app: Application, req: Request, date: Date, sitesCode: string[]) {
        this.mock = JSON5.parse(getCachedFile(req.app, mockDataPath));
        this.app = app;
        // NOTE(malavv): The mocked and proxy data, should probably eventually be in the SiteProxy.
        this.sitesProxy = new Sites(req);
        this.date = date;
        this.sitesCode = sitesCode;
        // @ts-ignore
        this.mode = req.query.mode || "real"; // Defaults to real query.
    }

    public getPanelViewModel(panelId: string): Promise<any> {
        switch (this.mode) {
            case "real":
                return this.getOrCompute(panelId + format(this.date, 'yyyy-MM-dd'),
                    () => this.computePanel(panelId));
            case "mock":
                return Promise.resolve(this.mock[panelId]);
            case "lagmock":
                return resolveAfter(this.mock[panelId], getRandomInt(1, maxJitterMs));
            default:
                return Promise.reject(`Incorrect Query mode : ${this.mode}`);
        }
    }

    private async computePanel(panelId: string): Promise<any> {
        switch (panelId) {
            // Line 1
            case 'p1':
                return this.computePanel1();
            case 'p2':
                return this.computePanel2();
            case 'p3':
                return this.computePanel3();
            // Line 2
            case 'p4':
                return this.computePanel4();
            case 'p5':
                return this.computePanel5();
            case 'p6':
                return this.computePanel6();
            // line 3
            case 'p7':
                return this.computePanel7();
            case 'p8':
                return this.computePanel8();
            case 'p9':
                return this.computePanel9();
            case 'p10':
                return this.computePanel10();
            case 'p11':
                return this.computePanel11();
            case 'p12':
                return this.computePanel12();
            // No match
            default:
                return Promise.reject(new Error(`Invalid Panel ID ${panelId}`));
        }
    }

    private async computePanel1(): Promise<any> {
        return this.sitesProxy.getCohortSizeOnDate(this.date, this.sitesCode)
            .then((numberInCohort: number) => ({
                "total_count": numberInCohort, // Total number of "participants" in our cohort at this date.
                "prevalence": 0.07 // fraction of the cohort that is COVID-19 positive
            }));
    }

    private async computePanel2(): Promise<any> {
        return this.sitesProxy.getNewCasesOnDate(this.date, this.sitesCode)
            .then((newPosOnDate: number) => ({
                "date": format(this.date, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newPosOnDate, // Count of Patient with COVID+ tests on this day.
                "sma_7d": 351, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 1.07 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel3(): Promise<any> {
        return this.sitesProxy.getNewCaseFatalityOnDate(this.date, this.sitesCode)
            .then((newDeathsOnDate: number) => ({
                "date": format(this.date, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newDeathsOnDate, // Number of new members of this cohort that were COVID-19 positive and died
                "sma_7d": 10, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 1.04 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel4(): Promise<any> {
        return Promise.all([
            this.sitesProxy.getNewDailyPosPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode),
            this.sitesProxy.getNewDailyTestsPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode)
        ]).then(res => {
            const [posBreakdown, totalBreakdown] = res;
            // Get common date ! this assumes both request returns the same dates!.
            const formattedDates = totalBreakdown.dates.map((d: Date) => format(d, "yyyy-MM-dd"));

            // Check returned the same sites.
            const positSites: Set<string> = new Set(Object.keys(posBreakdown.sites));
            const totalSites: Set<string> = new Set(Object.keys(totalBreakdown.sites));

            console.assert(isSetsEquals(positSites, totalSites), 'The two queries should contain the same sites.');

            const divideOrNan = (arr: number[]) => {
                return arr[0] == null || arr[1] == null ? Number.NaN : arr[0] / arr[1];
            }
            // Get the proportion.
            let sites: { [site: string]: { est: number[] } } = {};
            // NOTE(malavv) : Sites data are "implicitly" aligned with dates, but not directly mapped. Meaning there must be perfect alignment from the results. i.e. no results missing for any dates.
            totalSites.forEach(site => {
                sites[site] = {est: zip(posBreakdown.sites[site], totalBreakdown.sites[site]).map(divideOrNan)}
            })

            // FIXME(malavv): No LOESS yet, maybe client side?
            return {
                // Results are in the same exact order as the dates.
                "dates": formattedDates,
                "sites": sites
            }
        });
    }

    private async computePanel5(): Promise<any> {
        return this.sitesProxy.getNewDailyPosPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode)
            .then(posBreakdown => {
                // Get common date ! this assumes both request returns the same dates!.
                const formattedDates = posBreakdown.dates.map((d: Date) => format(d, "yyyy-MM-dd"));

                // Get the proportion.
                let sites: { [site: string]: { est: number[] } } = {};
                Object.keys(posBreakdown.sites).forEach((site: string) => {
                    sites[site] = {est: posBreakdown.sites[site]}
                })

                return {
                    // FIXME(malavv): no predictions yet.
                    start_of_predictions: last(sortBy(formattedDates, i => i)),
                    // Results are in the same exact order as the dates.
                    "dates": formattedDates,
                    "sites": sites
                }
            });
    }

    private async computePanel6(): Promise<any> {
        return Promise.all([
            this.sitesProxy.getNewDailyIcuPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode),
            this.sitesProxy.getNewDailyWardPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode)
        ]).then(res => {
            const [icuBreakdown, wardBreakdown] = res;
            // Get common date ! this assumes both request returns the same dates!.
            const formattedDates = icuBreakdown.dates.map((d: Date) => format(d, "yyyy-MM-dd"));

            let sites: { [site: string]: { est: number[] } } = {};
            sites["WARD"] = {est: wardBreakdown.sites["all"]}
            sites["ICU"] = {est: icuBreakdown.sites["all"]}

            return {
                // Results are in the same exact order as the dates.
                "dates": formattedDates,
                "sites": sites
            }
        });
    }

    private async computePanel7(): Promise<any> {
        return this.sitesProxy.getActiveIcuOnDate(this.date, this.sitesCode)
            .then(sites => ({"sites": ObjectFromEntries(sites)}));
    }

    private async computePanel8(): Promise<any> {
        // FIXME(malavv): Panel logic is not implemented
        return Promise.resolve(this.mock['p8']);
    }

    private async computePanel9(): Promise<any> {
        // FIXME(malavv): Panel logic is not implemented
        return Promise.resolve(this.mock['p9']);
    }

    private async computePanel10(): Promise<any> {
        // FIXME(malavv): Panel logic is not implemented
        return Promise.resolve(this.mock['p10']);
    }

    private async computePanel11(): Promise<any> {
        // FIXME(malavv): Panel logic is not implemented
        return Promise.resolve(this.mock['p11']);
    }

    private async computePanel12(): Promise<any> {
        // FIXME(malavv): Panel logic is not implemented
        return Promise.resolve(this.mock['p12']);
    }

    /**
     * Get from cache or compute and cache.
     * @param key Cache key
     * @param factory Compute function
     * @private
     */
    private getOrCompute(key: string, factory: () => Promise<any>): Promise<any> {
        // @ts-ignore
        const cached = this.app.get(key);
        if (cached !== undefined)
            return Promise.resolve(cached);

        return factory().then(data => {
            // @ts-ignore
            this.app.set(key, data)
            return data;
        });
    }
}

