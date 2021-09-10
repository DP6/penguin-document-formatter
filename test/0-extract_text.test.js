const { strictEqual, deepStrictEqual, ok } = require('assert');
const path = require('path');

const { pdfToJson } = require('../src/pdf2text');

const MAPA = { path: path.basename('../sitedp6.pdf'), paginas: 1 };

const CHAVES = ['x', 'y', 'text'];

let dados;
describe('Extrai json do PDF', function () {
    before(async () => {
        dados = await pdfToJson(MAPA.path);
    })
    it('Retorna um array', () => {
        ok(Array.isArray(dados));
    });

    it(`Extraiu ${MAPA.paginas} paginas com eventos`, () => {
        deepStrictEqual(dados.length, MAPA.paginas);
    });

});