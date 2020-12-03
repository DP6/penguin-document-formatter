const path = require('path');
const os = require('os');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const { pdfToJson } = require('./pdf2text');

exports.extractText = async function extractText(event, context) {
    try {
        const { bucket, name } = event;

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

        const bucketJson = 'dq-doc-formatter-json-csf';
        const size = data.length;
        const filePath = name.split(".pdf")[0];

        data.forEach(
            async (file, index) => {
                try {
                    let newFilePath = `${filePath}/output_${index}_to_${size}.json`
                    await storage.bucket(bucketJson).file(newFilePath).save(JSON.stringify(file, null, 2));
                    console.log("Info", `${newFilePath} created to ${bucketJson}.`);
                } catch (error) {
                    console.error(error);
                }
            }
        );
    } catch (error) {
        console.error("ERRO!", error);
    }
}