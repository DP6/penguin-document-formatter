const PDFParser = require('pdf2json');
const sendData = require('./hub');
const { extractEvents } = require('./extractEvents');

exports.pdfToJson = async function pdfToJson(path) {
    try {
        let data = await getPdfData(path);
        return data;
    } catch (error) {
        console.error('Erro: ', error.message);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao extrair texto do pdf",
                payload: {
                    error: error.message
                }
            }
        );
    }
}

function getPdfData(path) {
    let config = require('./config.json');
    let nomeMapa = path.split(".pdf")[0];
    return new Promise(function (resolve, reject) {
        const pdfParser = new PDFParser();
        pdfParser.loadPDF(path);
        pdfParser.on('pdfParser_dataError', function (errData) {
            reject(errData.parseError);
        });

        pdfParser.on('pdfParser_dataReady', function (pdfData) {
            const json = formatJson(pdfData);
            let pages = [];
            json.forEach(async function (content, pageNumber) {
                let extraction = await extractEvents(content, pageNumber + 1, nomeMapa, config);
                if (extraction.events.length > 0) pages.push(extraction);
            });
            resolve(pages);
        })
    }).then(value => value)
}


function formatJson(pdfData) {
    let string = decodeURIComponent(JSON.stringify(pdfData, null, 2));
    const regex = /"T": "(.*)("(.*)")(.*)"/g, replaceText = '"T": "$1\'$3\'$4"',
        regexSimple = /"T": "(.*)(")(.*)"/g, replaceTextSimple = '"T": "$1\'$3"';
    while (regex.test(string)) {
        string = string.replace(regex, replaceText);
    }
    while (regexSimple.test(string)) {
        string = string.replace(regexSimple, replaceTextSimple);
    }
    let json = JSON.parse(string);
    let pages = json['Pages'];
    pages = pages
        .map((page) => {
            let texts = page['Texts'];
            texts = texts.map((text) => {
                return {
                    x: text.x,
                    y: text.y,
                    text: text.R.map((r) => r.T).join('').replace(':', ''),
                };
            });
            return texts;
        })
        .map((page) =>
            page.sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y)
        );
    return pages;
}