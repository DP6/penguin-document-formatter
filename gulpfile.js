const { series, parallel, src, dest, watch } = require('gulp');
const mocha = require('gulp-mocha');

function moveConfig() {
    return src('src/config.json').pipe(dest('functions/extract-events'));
}

function extractJson() {
    return src('src/pdf2text.js').pipe(dest('functions/convert-pdf-to-json/'));
}

function saveFile() {
    return src('src/saveFile.js').pipe(dest('functions/extract-events'));
}

function extractEvents() {
    return src('src/extractEvents.js').pipe(dest('functions/extract-events'));
}

function formatEvents() {
    return src('src/formatEvents.js').pipe(dest('functions/extract-events'));
}

function bigQuery() {
    return src('src/bigquery.js').pipe(dest('functions/extract-events'));
}

function test() {
    return src(['test/*.js']).pipe(mocha());
}

exports.build = series(test, parallel(moveConfig, extractJson, saveFile, extractEvents, formatEvents));