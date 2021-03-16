const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');

class Stats {
    static async summarize(req) {
        const sites = [115, 112];




        return await axios.get('/stats/summarize', passAuth(req)).then(res => res.data);
    }
}

module.exports = Stats;