const { series, parallel, src, dest, watch } = require('gulp');
const mocha = require('gulp-mocha');
const zip = require('gulp-zip');

//Convert pdf to json
function extractJson() {
    return src('src/pdf2text.js').pipe(dest('functions/convert-pdf-to-json/'));
}

function convertHub() {
    return src('src/hub.js').pipe(dest('functions/convert-pdf-to-json/'));
}

function convertFirestore() {
    return src('src/firestore.js').pipe(dest('functions/convert-pdf-to-json/'));
}

function zipConvert() {
    return src('functions/convert-pdf-to-json')
        .pipe(zip('convert-pdf-to-json.zip'))
        .pipe(dest('dist'))
}


//Extract events from file
function saveFile() {
    return src('src/saveFile.js').pipe(dest('functions/convert-pdf-to-json'));
}

function extractEvents() {
    return src('src/extractEvents.js').pipe(dest('functions/convert-pdf-to-json'));
}

function formatEvents() {
    return src('src/formatEvents.js').pipe(dest('functions/convert-pdf-to-json'));
}

function extractHub() {
    return src('src/hub.js').pipe(dest('functions/extract-events/'));
}

function extractFirestore() {
    return src('src/firestore.js').pipe(dest('functions/extract-events/'));
}


function zipExtract() {
    return src('functions/extract-events')
        .pipe(zip('extract-events.zip'))
        .pipe(dest('dist'))
}

//Receive hub messages
function moveHub() {
    return src('src/hub.js').pipe(dest('functions/hub-receive-message/'));
}

function zipHubMessage() {
    return src('functions/hub-receive-message')
        .pipe(zip('hub-receive-message.zip'))
        .pipe(dest('dist'))
}


function test() {
    return src(['test/*.js']).pipe(mocha());
}



exports.build = series(
    test,
    parallel(extractJson, convertHub, convertFirestore, saveFile, extractEvents,),
    parallel(formatEvents, extractHub, extractFirestore),
    parallel(zipConvert, zipExtract, zipHubMessage)
);