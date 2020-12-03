//## Arquivo para execução e testes locais
const { argv } = process;

const { pdfToJson } = require('./src/pdf2text');
const { getEvents_local, saveAllFiles } = require('./src/local');
const { formatEvents } = require('./src/formatEvents');

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

        let pages = getEvents_local(files);

        console.log(`extraidas ${pages.length} paginas`);

        pages.forEach((page, index) => {
            let { info, events } = page;
            console.log(`pagina ${index} com ${page.events.length} eventos`)

            let { pageview, eventos } = formatEvents(events, info, index);
            //TODO consolidar eventos
            console.log("\n=======================\n");
            console.log("PAGEVIEW:\n");
            console.log(pageview);
            console.log("\nEVENTS:\n");
            console.log(eventos);
            console.log("\n=======================\n");/**/
        });


    } catch (error) {
        console.error(error);
    }
}

main(argv);