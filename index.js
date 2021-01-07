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

        let nomeMapa = file.split(".pdf")[0];

        const data = await pdfToJson(file);

        const files = saveAllFiles(file, data);

        let pages = getEvents_local(files, nomeMapa);

        console.log("\n----------------------------------------------------\n")
        console.log(`Nome do mapa: ${nomeMapa}`)
        console.log(`Número de páginas: ${files.length}`)
        console.log(`Número de páginas extraidas: ${pages.length} paginas`);
        console.log("\n----------------------------------------------------\n")

        pages.forEach((page, index) => {
            let { info, events } = page;
            console.log(`pagina ${info.pageNumber} com ${page.events.length} eventos`)
            let { pageview, eventos } = formatEvents(events, info);
            //TODO consolidar eventos
            console.log("\n=======================\n");
            console.log("PAGEVIEW:\n");
            console.table(pageview);
            console.log("\nEVENTS:\n");
            console.table(eventos);
            console.log("\n=======================\n");/**/
        });


    } catch (error) {
        console.error(error);
    }
}

main(argv);
