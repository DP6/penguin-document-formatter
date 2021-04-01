const { PubSub } = require('@google-cloud/pubsub');
const { insertRowsAsStream } = require('./bigquery');
const { get } = require('./firestore');
const schemas = require('./schemas.json');

/**
 * Wrapper that sends message to pub/sub
 * @param {Object} data - Object to be sent
 * @param {String} topic - Pub/Sub topic name
 * @returns 
 */
async function sendMessage(data, topic) {
    const pubSubClient = new PubSub();
    try {
        const dataBuffer = Buffer.from(JSON.stringify(data));
        const messageId = await pubSubClient.topic(topic).publish(dataBuffer);
        return messageId;
    } catch (error) {
        console.error("HUB: Erro ao enviar mensagem para o pub/sub");
        return error;
    }
}


/**
 * Sends a data quality alert to the pub/sub topic with the log format
 * @param {Number} code - A http code with the status
 * @param {String} message - The message to be sent as alert  
 * 
 */
async function publishAlert({ jobId, code, message, document, page, version }) {
    const { topicName } = await get("raft-suite/config");
    const deployVersion = process.env['K_REVISION'],
        functionName = process.env['K_SERVICE'],
        project = process.env.GCLOUD_PROJECT;

    let log = {
        date: new Date(),
        jobId,
        project,
        module: functionName,
        deploy: deployVersion,
        version,//: 'beta', //pegar do bq ou datastore ,
        document,
        page,
        status:
        {
            code,
            message
        }
    }

    try {
        const messageid = await sendMessage(log, topicName);
        console.info(`Message ${messageid} published to the topic`);
    } catch (error) {
        console.error(error);
    }
}

async function receiveMessage(event, context) {
    let message = event.data ? Buffer.from(event.data, 'base64').toString() : undefined;
    try {
        await insertRowsAsStream(message, datasetId, tableId, schemas.hub);
    } catch (error) {
        console.error(error);
    }
}



exports = {
    publishAlert,
    sendMessage
}


let teste = {
    "event": "teste",
    "context": "teste"
};