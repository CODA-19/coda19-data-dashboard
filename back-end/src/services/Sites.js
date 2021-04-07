const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');

class Sites {
    static async listConnected(req) {
        return await axios.get('/info', passAuth(req))
            .then(res => res.data)
            .then(Sites.convertName);
    }

    static code2name(code) {
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
    static makeNames(code) {
        let txt = Sites.code2name(code);
        return {
            "fr": `Hôpital ${txt}`,
            "en": `${txt} Hospital`
        }
    }
    static convertName(pkg) {
        let conn = pkg["connections"];
        let api = pkg["api_version"];

        let res = [];
        for (let c of conn) {
            let {fr, en} = Sites.makeNames(c.uid);
            c["name"] = en;
            c["names"] = {"fr": fr, "en": en};
            res.push(c);
        }

        return {
            "connections": conn,
            "api_version": api
        };
    }
}
// 102 et 103 = VALERIA
// 110 = CHUM
// 115 = CHUQ-UL
// 116 = CISSS-CA
// 112 = JGH

module.exports = Sites;