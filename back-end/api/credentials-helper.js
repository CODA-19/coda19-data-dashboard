function getCredentialsHeader(req) {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
        }
    };
}

module.exports = getCredentialsHeader