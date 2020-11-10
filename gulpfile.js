const { series, parallel, src, dest, watch } = require('gulp');
const mocha = require('gulp-mocha');

function extractJson() {
    return src('src/pdf2text.js').pipe(dest('functions/convert-pdf-to-json/'));
}

function saveFile() {
    return src('src/saveFile.js').pipe(dest('functions/extract-events'));
}

function extractEvents() {
    return src('src/extractEvents.js').pipe(dest('functions/extract-events'));
}


function test() {
    return src(['test/*.js']).pipe(mocha());
}

exports.build = series(test, parallel(extractJson, saveFile, extractEvents));