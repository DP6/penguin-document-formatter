const config = require('./test_config.json');

const { strictEqual, deepStrictEqual, ok } = require('assert');

const { pdfToJson } = require('../src/pdf2text');
const { getEvents_local, saveAllFiles } = require('../src/local');
const { formatEvents } = require('../src/formatEvents');

const EXPECTED_PAGE_KEYS = ['pagename', 'versao', 'tela', 'pagina_mapa', 'nome_mapa'];
const EXPECTED_EVENT_KEYS = [
    'eventType',
    'eventCategory',
    'eventAction',
    'eventLabel',
    'pagename',
    'versao',
    'tela',
    'pagina_mapa',
    'nome_mapa'
];

const file = "sitedp6.pdf";
let files, pages, actual_pageview, actual_eventos;
describe('Formata eventos para consolidar', function () {
    before(async () => {

        const data = await pdfToJson(file);
        pages = data;
    });

    it('Executa a formatação', () => {
        pages.forEach((page, index) => {
            let { info, events } = page;
            let { pageview, eventos } = formatEvents(events, info);

            actual_pageview = pageview;
            actual_eventos = eventos;
        });
        ok(true);
    })

    it('Formata os pageviews no schema', () => {
        const actual = Object.keys(actual_pageview[0]);
        deepStrictEqual(actual, EXPECTED_PAGE_KEYS);
    });

    it('Encontrou um pageview', () => {
        const actual = actual_pageview.length;
        deepStrictEqual(actual, 1);
    });

    it('Formata os eventos no schema', () => {
        const actual = Object.keys(actual_eventos[0]);
        deepStrictEqual(actual, EXPECTED_EVENT_KEYS);
    });

    it('Encontrou 4 eventos', () => {
        const actual = actual_eventos.length;
        deepStrictEqual(actual, 4);
    });
});

