const config = require('./test_config.json');

const { strictEqual, deepStrictEqual, ok } = require('assert');

const { pdfToJson } = require('../src/pdf2text');
const { getEvents_local, saveAllFiles } = require('../src/local');

const FILE = "sitedp6.pdf";
const EXPECTED = {
    paginas: 1,
    eventos: 5
}

const EXPECTED_PAGEVIEW = [
    { key: 'Evento:', value: 'page_view' },
    { key: 'pageName:', value: '[path-da-pagina]' },
    { key: 'Idioma do site', value: 'pt' }
];

const EXPECTED_KEYS_PADRAO = ['Evento:', 'eventCategory:', 'eventAction:', 'eventLabel:'];

const EXPECTED_KEYS_EXTRA = [
    'Evento:',
    'eventCategory:',
    'eventAction:',
    'eventLabel:',
    'Parceiro'
];

let files, pages;
describe('Extrair eventos', function () {
    before(async () => {

        const data = await pdfToJson(FILE);

        files = saveAllFiles(FILE, data);

        pages = getEvents_local(files, FILE, config);
    });

    it("Extrai uma página com eventos do pdf", () => {
        deepStrictEqual(pages.length, EXPECTED.paginas);
    });

    it("Extrai 5 eventos do pdf", () => {
        deepStrictEqual(pages[0].events.length, EXPECTED.eventos);
    });

    it("Identifica um pageview com custom parameter", () => {
        const actual = pages[0].events.filter(item => item.filter(key => key.value == "page_view").length > 0).flat();
        deepStrictEqual(actual, EXPECTED_PAGEVIEW);
    });

    it("Identifica pelo menos um evento com category, action e label", () => {
        const actual = pages[0].events.filter(item => item.filter(key => /event(Category|Action|Label)/.test(key.key)).length > 0);
        //console.log(actual);

        const keys = actual[0].map(item => item.key);
        ok(keys.length >= 3);
        deepStrictEqual(keys, EXPECTED_KEYS_PADRAO);
    });

    it("Identifica pelo menos um evento com outros parâmetros", () => {
        let actual = pages[0].events.filter(item => item.filter(key => /event(Category|Action|Label)/.test(key.key)).length > 0);
        //console.log(actual);
        actual = actual.filter(item => item.length > 4).flat();
        const keys = actual.map(item => item.key);
        ok(keys.length >= 4);
        deepStrictEqual(keys, EXPECTED_KEYS_EXTRA);
    });
});