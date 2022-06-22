function sendData({ code, spec, description, payload }) {
    const axios = require('axios');
    let body = {
        module: process.env['K_SERVICE'],
        deploy: process.env['K_REVISION'],
        spec:  spec,
        code,
        description,
        payload
    }
    axios.post('https://us-central1-raiadrogasil-280519.cloudfunctions.net/hub_raft_suite', body);
}

module.exports = { sendData };