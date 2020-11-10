const { strictEqual, deepStrictEqual, ok } = require('assert');
const path = require('path');
const { saveFile } = require('../src/saveFile');
const fs = require('fs');

const dir = './tmp/';
const NOME = dir + 'temporario.txt';
const TEXTO = '"Hello world"'
describe('Salvar arquivos', function () {
    before(() => {
        try {
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
            if (fs.existsSync(NOME))
                fs.unlinkSync(NOME);
        } catch (error) {
            console.error(error);
        }
    })
    it('Salva um arquivo generico', () => {

        saveFile(NOME, 'Hello world');

        const arquivo = fs.readFileSync(NOME, { encoding: 'utf-8' });

        deepStrictEqual(arquivo, TEXTO);

        fs.unlinkSync(NOME);
    });
});