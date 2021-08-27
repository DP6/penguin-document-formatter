const PDFParser = require('pdf2json');
const sendData = require('./hub');

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


function mergeRow(group, limit = 0) {
    let copy = [];
    let temp = null;
    const size = (56.67 - 54.955) / 6;
    for (var i in group) {
        if (temp === null) temp = group[i];
        const item = temp;
        if (i == group.length - 1) {
            copy.push(item);
            temp = null;
            continue;
        }
        const j = +i + 1;
        const next = group[j];
        let dif = next.x - item.x - item.text.length * size;
        if (dif > limit) {
            copy.push(item);
            temp = null;
        }
        else {
            const concat = item.text + next.text;
            temp = { ...item, text: concat };
        }
    }
    return copy;
}

function getPdfData(path) {
    return new Promise(function (resolve, reject) {

        const pdfParser = new PDFParser();

        pdfParser.loadPDF(path);
        pdfParser.on('pdfParser_dataError', function (errData) {
            reject(errData.parseError);
        });
        pdfParser.on('pdfParser_dataReady', function (pdfData) {
            const json = formatJson(pdfData);
            resolve(json);
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
    let pages = json['formImage']['Pages'];
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
