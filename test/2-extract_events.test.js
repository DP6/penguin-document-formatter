const config = require('./test_config.json');

const { strictEqual, deepStrictEqual, ok } = require('assert');

const { pdfToJson } = require('../src/pdf2text');
const { getEvents_local, saveAllFiles } = require('../src/local');

const FILE = "sitedp6.pdf";
const EXPECTED = {
    paginas: 1,
    eventos: 5
}

const EXPECTED_PAGEVIEW = { Evento: 'page_view', pageName: '[path-da-pagina]' };

const EXPECTED_KEYS_PADRAO = ['Evento', 'eventCategory', 'eventAction', 'eventLabel'];

let files, pages;
describe('Extrair eventos', function () {
    before(async () => {

        const data = await pdfToJson(FILE);
        pages = data;
    });

    it("Extrai uma página com eventos do pdf", () => {
        deepStrictEqual(pages.length, EXPECTED.paginas);
    });

    it("Extrai 5 eventos do pdf", () => {
        deepStrictEqual(pages[0].events.length, EXPECTED.eventos);
    });

    it("Identifica pelo menos um evento com category, action e label", () => {
        const actual = pages[0].events.map(e => Object.keys(e))
            .filter(keys => keys.includes('eventCategory') && keys.includes('eventAction') && keys.includes('eventLabel'));
        let keys = actual[0];
        ok(keys.length >= 3);
        deepStrictEqual(keys, EXPECTED_KEYS_PADRAO);
    });

});