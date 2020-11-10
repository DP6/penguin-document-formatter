const PDFParser = require('pdf2json');

exports.pdfToJson = async function pdfToJson(path) {
    try {
        let data = await getPdfData(path)
        return data;
    } catch (error) {
        console.error('Erro: ', error.message);
    }
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
    let json = JSON.parse(decodeURIComponent(JSON.stringify(pdfData, null, 2)));
    let pages = json['formImage']['Pages'];
    pages = pages
        .map((page) => {
            let texts = page['Texts'];
            texts = texts.map((text) => {
                return {
                    x: text.x,
                    y: text.y,
                    text: text.R.map((r) => r.T).join(''),
                };
            });
            return texts;
        })
        .map((page) =>
            page.sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y)
        );
    return pages;
}
