import {Application, Request} from 'express';
import{ format } from 'date-fns';
import {Sites} from "./Sites";
import {zip, sortBy, last} from 'underscore';
import {isSetsEquals, ObjectFromEntries} from "../helpers/poly";

export type PerSiteNumber = {[site: string]:number};

export class DashPanels {
    mock: {[panel: string]:Object};
    app: Application;
    sitesProxy: Sites;
    date: Date;
    sitesCode: string[];

    constructor(mock: {[panel: string]:Object}, app: Application, req: Request, date: Date, sitesCode: string[]) {
        this.mock = mock;
        this.app = app;
        this.sitesProxy = new Sites(req);
        this.date = date;
        this.sitesCode = sitesCode;
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
            // Line 2
            case 'p4': return this.computePanel4().then(res => { this.setCache(panelId, res); return res; });
            case 'p5': return this.computePanel5().then(res => { this.setCache(panelId, res); return res; });
            case 'p6': return this.computePanel6().then(res => { this.setCache(panelId, res); return res; });
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
        return this.sitesProxy.getCohortSizeOnDate(this.date, this.sitesCode)
            .then((numberInCohort: number) => ({
                "total_count": numberInCohort, // Total number of "participants" in our cohort at this date.
                "prevalence": 0.07 // fraction of the cohort that is COVID-19 positive
            }));
    }

    private async computePanel2() : Promise<any> {
        return this.sitesProxy.getNewCasesOnDate(this.date, this.sitesCode)
            .then((newPosOnDate: number) => ({
                "date": format(this.date, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newPosOnDate, // Count of Patient with COVID+ tests on this day.
                "sma_7d": 351, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 1.07 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel3() : Promise<any> {
        return this.sitesProxy.getNewCaseFatalityOnDate(this.date, this.sitesCode)
            .then((newDeathsOnDate: number) => ({
                "date": format(this.date, "yyyy-MM-dd"), // Date associated with this result
                "new_cases": newDeathsOnDate, // Number of new members of this cohort that were COVID-19 positive and died
                "sma_7d": 10, // 7d moving average over the day prior to "date"
                "exp_rate_7d": 1.04 // Instantaneous Exponential Rate based on the last 7 day.
            }));
    }

    private async computePanel4() : Promise<any> {
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
            let sites: {[site: string]: {est: number[]}} = {};
            // NOTE(malavv) : Sites data are "implicitly" aligned with dates, but not directly mapped. Meaning there must be perfect alignment from the results. i.e. no results missing for any dates.
            totalSites.forEach(site => {
                sites[site] = { est: zip(posBreakdown.sites[site], totalBreakdown.sites[site]).map(divideOrNan) }
            })

            // FIXME(malavv): No LOESS yet, maybe client side?
            return {
                // Results are in the same exact order as the dates.
                "dates": formattedDates,
                "sites": sites
            }
        });
    }

    private async computePanel5() : Promise<any> {
        return this.sitesProxy.getNewDailyPosPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode)
            .then(posBreakdown => {
                // Get common date ! this assumes both request returns the same dates!.
                const formattedDates = posBreakdown.dates.map((d: Date) => format(d, "yyyy-MM-dd"));

                // Get the proportion.
                let sites: {[site: string]: {est: number[]}} = {};
                Object.keys(posBreakdown.sites).forEach((site: string) => {
                    sites[site] = { est: posBreakdown.sites[site] }
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

    private async computePanel6() : Promise<any> {
        return Promise.all([
            this.sitesProxy.getNewDailyIcuPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode),
            this.sitesProxy.getNewDailyWardPerSiteBetween(new Date("2021/01/01"), this.date, this.sitesCode)
        ]).then(res => {
            const [icuBreakdown, wardBreakdown] = res;
            // Get common date ! this assumes both request returns the same dates!.
            const formattedDates = icuBreakdown.dates.map((d: Date) => format(d, "yyyy-MM-dd"));

            let sites: {[site: string]: {est: number[]}} = {};
            sites["WARD"] = { est: wardBreakdown.sites["all"] }
            sites["ICU"] = { est: icuBreakdown.sites["all"] }

            return {
                // Results are in the same exact order as the dates.
                "dates": formattedDates,
                "sites": sites
            }
        });
    }

    private async computePanel7() : Promise<any> {
        return this.sitesProxy.getActiveIcuOnDate(this.date, this.sitesCode)
            .then(sites => ({"sites" : ObjectFromEntries(sites)}));
    }
}

