const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');

const storage = new Storage();

const pdfToJson = require('./pdf2text');

exports.extractText = async function extractText(object, context) {
    try {
        const { bucket, name } = object;

        if (!/\.pdf/i.test(name))
            throw new Error(`O arquivo ${name} não é um pdf`);

        const fileName = path.basename(name);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        const options = {
            destination: tempFilePath
        }

        await storage.bucket(bucket).file(name).download(options);
        console.info("Info", `File gs://${bucket}/${name} download to: ${tempFilePath}`);

        const data = await pdfToJson(tempFilePath);

        //TODO salvar os arquivos output_x_to_y.json no GCS
    } catch (error) {
        console.error("ERRO!", error);
    }
}