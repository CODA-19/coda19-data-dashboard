let token = '';

function setToken(newToken) {
    token = newToken;
}

function getToken() {
    return token;
}

export default {
    getToken,
    setToken
}