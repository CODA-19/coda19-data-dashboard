import axios from '../helpers/axios';
import passAuth from '../auth/auth';
import {Request} from 'express';
import {SiteInfoRequest} from "../../coda19-ts/src/request/SiteInfoRequest";

type I18nString = {fr: string, en: string};

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
function localizedNameFromCode(code: string) : I18nString {
    const txt = code2name(code);
    return { "fr": `Hôpital ${txt}`,  "en": `${txt} Hospital` }
}
// FIXME(malavv): The names should come from each sites, not being faked here.
function code2name(code:string): string {
    switch (code) {
        case '103':
        case '102': return 'VALERIA';

        case '110': return 'CHUM';
        case '115': return 'CHUQ-UL';
        case '116': return 'CISSS-CA';
        case '112': return 'JGH';

        default: return 'Unknown';
    }
}

/**
 * Facade structure to site resources.
 *
 * Goal is to focus on what you want, and not on how to get it.
 */
export class Sites {
    /**
     * List of sites connected and their resources.
     *
     * Only information available at startup on these sites will be available through this request.
     * @param req Request from the client.
     */
    static listConnected(req: Request) : Promise<SiteInfoRequest> {
        return axios.get('/info', passAuth(req))
            .then((res: any) => res.data)
            .then(convertMock2Name);
    }
}
