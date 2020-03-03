const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/app-api', {target: 'http://10.188.0.46:8080'}));
};
