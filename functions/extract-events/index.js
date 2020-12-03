const fs = require('fs');
const path = require('path');
const os = require('os');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const { extractEvents } = require('./extractEvents');
const { formatEvents } = require('./formatEvents');

exports.extractEvents = async function (event, context) {

    try {

        const datasetId = 'dq_raft_suite', eventsTableId = 'eventos', pageviewsTableId = 'pageviews';

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
            const dataset = bigquery.dataset(datasetId);

            await dataset.table(pageviewsTableId).insert(pageview);

            await dataset.table(eventsTableId).insert(eventos);
        }

        fs.unlinkSync(tempFilePath);

        /**/

    } catch (error) {
        console.error(error);
    }
}

