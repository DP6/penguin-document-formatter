

function sendData({ code, spec, description, payload }) {
    const axios = require('axios');
    let body = {
        module: 'penguin-datalayer-collect',
        deploy: process.env['K_REVISION'],
        spec: process.env['K_SERVICE'] + spec,
        code,
        description,
        payload
    }
    axios.post('https://us-central1-dp6-brasil.cloudfunctions.net/hub-raft-suite', body);
}

module.exports = { sendData };