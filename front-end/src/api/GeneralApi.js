// TODO: Not a good name for the api, but my knowledge of it's context is too limited to figure out the appropriate api name. <- Kevin
// Maybe refactor into multiple routes with more specific names?
import AxiosInstance from './AxiosInstance';
import TokenBearerHeaderFactory from './TokenBearerHeaderFactory';

function data() {
    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.get('/api/data', {headers: headers});
}

function testData(post_data) {
    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.post('api/testData', post_data, {headers: headers});
}

function nsummary(sitesUri, varUri, breakdownUri) {
    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.get(`api/nsummary?sites=${sitesUri}&var=${varUri}&breakdown=${breakdownUri}`, {headers: headers});
}

function mockStats(sitesUri, cont, disc) {
  const headers = TokenBearerHeaderFactory.get();
  return AxiosInstance.get(`api/mockStats?sites=${sitesUri}&cont=${cont}&disc=${disc}`, {headers: headers});
}

/**
 * Checks for a response from the hub.
 * @returns {Promise<Response>}
 */
async function isConnected() {
    const timeoutInMs = 100;
    return Promise.race([
        fetch(process.env.VUE_APP_CODA19_DASHBOARD_BACKEND_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutInMs))
    ]);
}

function getPanelURI(panelId, mode = null) {
    const modeQuery = mode == null ? '' : `?mode=${mode}`;
    return `/home/p${panelId}${modeQuery}`;
}

function DashData(i, mode = null){
  const headers = TokenBearerHeaderFactory.get();
  return AxiosInstance.get(getPanelURI(i, mode), {headers: headers});
  //return AxiosInstance.get(`/home/p${i}?mode=lagmock`, {headers: headers});
}

function Measures(){
  const headers = TokenBearerHeaderFactory.get();
  return AxiosInstance.get(`stats/measures`, {headers: headers});
}


export default {
    data,
    nsummary,
    testData,
    isConnected,
    DashData,
    Measures,
    mockStats
}
