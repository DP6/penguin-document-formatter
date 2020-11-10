const { strictEqual, deepStrictEqual, ok } = require('assert');
const path = require('path');
const { pdfToJson } = require('../src/pdf2text');

const MAPA = { path: path.basename('../sitedp6.pdf'), paginas: 3 };
const CHAVES = ['x', 'y', 'text'];

let dados;
describe('Extrai json do PDF', function () {
    before(async () => {
        dados = await pdfToJson(MAPA.path);
    })
    it('Retorna um array', () => {
        ok(Array.isArray(dados));
    });

    it(`Tem ${MAPA.paginas} paginas`, () => {
        deepStrictEqual(dados.length, 3);
    });

    it('Tem objetos com as chaves x, y e text', () => {
        deepStrictEqual(Object.keys(dados[1][0]), CHAVES);
    })
});