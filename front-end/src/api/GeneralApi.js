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

function nsummary(sitesUri, varUri) {
    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.get(`api/nsummary?sites=${sitesUri}&var=${varUri}`, {headers: headers});
}

function summary(){
  const headers = TokenBearerHeaderFactory.get();
  return AxiosInstance.get('api/hospitalSummary', {headers: headers});
}

export default {
    data,
    summary,
    nsummary,
    testData
}
