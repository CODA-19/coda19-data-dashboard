const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');

class Sites {
    static async listConnected(req) {
        return await axios.get('/info', passAuth(req)).then(res => res.data);
    }
}

module.exports = Sites;