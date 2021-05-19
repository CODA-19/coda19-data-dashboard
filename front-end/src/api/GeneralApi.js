// TODO: Not a good name for the api, but my knowledge of it's context is too limited to figure out the appropriate api name. <- Kevin
// Maybe refactor into multiple routes with more specific names?
import AxiosInstance from './AxiosInstance';
import TokenBearerHeaderFactory from './TokenBearerHeaderFactory';
import { isEqual } from "underscore";

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

function mockStats(sitesUri, cont, disc, resources, breakdown) {
  const headers = TokenBearerHeaderFactory.get();
  return AxiosInstance.get(`api/mockStats?sites=${sitesUri}&cont=${cont}&disc=${disc}&resources=${resources}&breakdown=${breakdown}`, {headers: headers});
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

function temporaryGetMockedTaskData(request, sites, force) {
    let url = 'unknown';

    // use force to make sure you get data for one of the two task.
    if (force !== undefined) {
        if (force === 1) {
            url = 'query_task_1'
        } else if (force === 2) {
            url = 'query_task_2'
        }

    // else behave properly if you get the matching config.
    } else {
        if (isEqual(request, request_task_1)) {
            url = 'query_task_1'
        } else if (isEqual(request, request_task_2)) {
            url = 'query_task_2'
        }
    }

    if (url === 'unknown') {
        console.warn('Incorrect summary request for temporary masked data.')
        return Promise.reject('invalid.request');
    }

    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.get(`stats/${url}`, {headers: headers});
}

export default {
    data,
    nsummary,
    testData,
    isConnected,
    DashData,
    Measures,
    mockStats,
    temporaryGetMockedTaskData
}

const request_task_1 = {
    "selectors": [
        {
            "resource": "Patient",
            "filters": [
                { "path": "deceasedBoolean", "operator": "is", "value": "false" }
            ],
            "fields": [ // Must be in right order to match with underscore
                { "path": "age" },
                { "path": "gender" }
            ]
        }
    ],
    "options": {
        "measures": {
            "continuous": [ "count", "mean", "stdev", "ci95" ],
            "categorical": [ "count", "mode" ]
        }
    }
};
const request_task_2 = {
    "selectors": [
        {
            "resource": "Patient",
            "filters": [
                { "path": "deceasedBoolean", "operator": "is", "value": "true" },
                { "path": "deceasedDateTime", "operator": "isNot", "value": "null" }
            ],
            "fields": [],
            "breakdown": {
                "resource": { "type": "Patient", "field": "deceasedDateTime" },
                "slices": { "step": 1209600, "min": "2021-01-01", "max": "2021-04-06" }
            }
        }
    ],
    "options": {
        "measures": {
            "continuous": [],
            "categorical": [ "count" ]
        }
    }
};