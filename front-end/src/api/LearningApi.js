import AxiosInstance from './AxiosInstance';
import TokenBearerHeaderFactory from './TokenBearerHeaderFactory';

async function getPrepare(body, sitesUri) {
    const headers = TokenBearerHeaderFactory.get();
    try {
        return await AxiosInstance.post(`learning/prepare?sites=${sitesUri}`, body, {headers: headers});
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run prepare query on backend");
    }    
}

async function getTrain(body, sitesUri) {
    const headers = TokenBearerHeaderFactory.get();
    try {
        return await AxiosInstance.post(`learning/train?sites=${sitesUri}`, body, {headers: headers, timeout: 2*60*1000});
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run train query on backend");
    }    
}

async function getProgress(body, sitesUri) {
    const headers = TokenBearerHeaderFactory.get();
    try {
        return await AxiosInstance.post(`learning/progress?sites=${sitesUri}`, body, {headers: headers,});
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run progress query on backend");
    }    
}

export default {
    getPrepare,
    getTrain,
    getProgress
}