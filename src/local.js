const fs = require('fs');
const path = require('path');

const { saveFile } = require('../src/saveFile');
const { extractEvents } = require('../src/extractEvents');

module.exports = {
    getEvents_local: getEvents_local,
    saveAllFiles: saveAllFiles
}

function getEvents_local(files, nomeMapa, config = null) {
    let pages = [];
    let pageNumber = 1
    files.forEach(function (file, index) {
        let content = fs.readFileSync(file, { encoding: 'utf-8' });
        
        let extraction;
       
        if (config != null)
            extraction = extractEvents(content, pageNumber, nomeMapa, config);
        else
            extraction = extractEvents(content, pageNumber, nomeMapa);
        pageNumber++
        if (extraction.events.length > 0) pages.push(extraction);
    });
    return pages;
}


function saveAllFiles(name, data) {

    const dev = true;
    var dir = dev ? './tmp/' : os.tmpdir();
    const filePath = path.join(dir, name);
    let files = [];
    if (dev && !fs.existsSync(dir))
        fs.mkdirSync(dir);

    const size = data.length;
    for (const file of data) {
        const index = data.indexOf(file) + 1;
        const newName = `${filePath.replace('pdf', '')}_output_${index}_to_${size}.json`;
        const saved = saveFile(newName, file);
        if (saved) {
            files.push(saved);
        }
    }
    return files;
}

