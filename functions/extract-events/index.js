const fs = require('fs');
const path = require('path');
const os = require('os');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const { extractEvents } = require('./extractEvents');
const { formatEvents } = require('./formatEvents');
const { get } = require('./hub');
const { insertRowsAsStream } = require('./bigquery');

exports.extractEvents = async function (event, context) {

    try {
        const { dataset, tables } = await get("raft-suite/config");
        const schemas = await get('raft-suite/schemas');

        const { bucket, name } = event;

        const fileName = path.basename(name);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        const options = {
            destination: tempFilePath
        }

        await storage.bucket(bucket).file(name).download(options);
        console.info("Info", `File gs://${bucket}/${name} download to: ${tempFilePath}`);

        const content = fs.readFileSync(tempFilePath, { encoding: 'utf-8' });
        const page = extractEvents(content);
        if (page.events.length > 0) {
            //console.log(page);
            let index = /.*(\d)_to_\d\.json/.test(name) ? name.match(/.*(\d)_to_\d\.json/) : [];
            index = index[1];
            let { info, events } = page;
            let { pageview, eventos } = formatEvents(events, info, index);
            console.info('Info', `Consolidando ${pageview.length} pageview com ${eventos.length} eventos`);
            await insertRowsAsStream([pageview], dataset, tables.pageview, schemas.pageviews);
            await insertRowsAsStream(events, dataset, tables.events, schemas.events);
            //rows, datasetId, tableName, schema
        }
        fs.unlinkSync(tempFilePath);
        /**/

    } catch (error) {
        console.error(error);
        publishAlert({
            jobId: "",
            code: 505,
            message: "Erro ao consolidar os dados no bigquery",
            document: fileName.split('.pdf')[0],
            page: '-',
            version: '-'
        });
    }
}

