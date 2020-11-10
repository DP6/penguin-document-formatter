//## Arquivo para execução e testes locais
const { argv } = process;

const path = require('path');
const os = require('os');
const fs = require('fs');


const { saveFile } = require('./src/saveFile');
const { pdfToJson } = require('./src/pdf2text');
const { extractEvents } = require('./src/extractEvents');


async function main(argv) {
    try {
        const file = argv[2];

        if (!file)
            throw new Error('Execute "node index.js [nome-do-pdf]"');
        if (!/\.pdf/i.test(file))
            throw new Error('Informe um arquivo .pdf ');

        console.info("Extraindo texto do arquivo", file);
        const data = await pdfToJson(file);

        const files = saveAllFiles(file, data);

        let pages = [];
        files.forEach(function (file, index) {
            let content = fs.readFileSync(file, { encoding: 'utf-8' });
            let extraction = extractEvents(content);

            if (extraction.length > 0) pages.push(extraction);
        });

        pages.forEach((page) => {
            console.log(page.events)
        });


    } catch (error) {
        console.error(error);
    }


}


function saveAllFiles(name, data) {

    const dev = true;
    var dir = dev ? './tmp/' : os.tmpdir();
    const filePath = path.join(dir, name);
    let files = [];
    if (dev && !fs.existsSync(dir))
        fs.mkdirSync(dir);

    const size = data.length;
    for (const file of data) {
        const index = data.indexOf(file) + 1;
        const newName = `${filePath.replace('pdf', '')}_output_${index}_to_${size}.json`;
        const saved = saveFile(newName, file);
        if (saved) {
            files.push(saved);
        }
    }
    return files;
}

main(argv)