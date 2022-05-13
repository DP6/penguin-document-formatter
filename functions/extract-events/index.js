const fs = require('fs');
const path = require('path');
const os = require('os');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const { formatEvents, formatEnhancedEcommerce, formatDataLayer } = require('./formatEvents');
const { sendData } = require('./hub');

exports.extractEvents = async function (event, context) {

    try {
        const { bucket, name } = event;
        const filePath = name.split(".pdf")[0];
        const fileName = path.basename(name);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        const options = {
            destination: tempFilePath
        }

        await storage.bucket(bucket).file(name).download(options);
        console.info("Info", `File gs://${bucket}/${name} download to: ${tempFilePath}`);

        const content = fs.readFileSync(tempFilePath, { encoding: 'utf-8' });
        const page = JSON.parse(content);
        if (page.events.length > 0) {
            let index = /.*(\d)_to_\d\.json/.test(name) ? name.match(/.*(\d)_to_\d\.json/) : [];
            if (index.length == 0) return;
            index = index[1];
            let { info, events } = page;
            let { pageview, eventos } = formatEvents(events, info, index);
            let { ecommerce } = formatEnhancedEcommerce(events, info);
            let { datalayer } = formatDataLayer(events, info);
            console.log(`pagina ${info.pageNumber} com ${pageview.length} pageviews, ${eventos.length} eventos de interação, ${ecommerce.length} de ecommerce e ${datalayer.length} de datalayer`);
            
            if (pageview) {
                sendData(
                    {
                        code: "01-00",
                        spec: filePath,
                        description: "Pageview extraido com sucesso",
                        payload: {
                            pageview: pageview
                        }
                    }
                );
            }
            if (eventos.length > 0) {
                sendData(
                    {
                        code: "01-00",
                        spec: filePath,
                        description: "Eventos de interação extraidos com sucesso",
                        payload: {
                            eventos
                        }
                    }
                );
            }
            if (ecommerce.length > 0) {
                sendData(
                    {
                        code: "01-00",
                        spec: filePath,
                        description: "Eventos de ecommerce extraidos com sucesso",
                        payload: {
                            ecommerce
                        }
                    }
                );
            }
            if (datalayer.length > 0) {
                sendData(
                    {
                        code: "01-00",
                        spec: filePath,
                        description: "Eventos de datalayer extraidos com sucesso",
                        payload: {
                            datalayer
                        }
                    }
                );
            }
        }
        fs.unlinkSync(tempFilePath);
    } catch (error) {
        console.error(error);
    }
}