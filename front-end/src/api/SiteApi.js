import AxiosInstance from './AxiosInstance';
import TokenBearerHeaderFactory from './TokenBearerHeaderFactory';

function get() {
    const headers = TokenBearerHeaderFactory.get();
    return AxiosInstance.get('/info', {headers: headers});
}


export default {
    get
}