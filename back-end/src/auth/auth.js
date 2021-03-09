// Anonymous function to pass authorization headers from client request to hub request.
module.exports = (req) => ({ headers: { 'Authorization': req.headers.authorization } });
