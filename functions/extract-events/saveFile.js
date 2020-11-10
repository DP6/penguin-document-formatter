const fs = require('fs');

exports.saveFile = function (name, data) {
    try {
        console.log('Salvando o arquivo', name);
        const file = fs.writeFileSync(name, JSON.stringify(data, null, 2), 'utf-8');
        return name;
    } catch (error) {
        console.error("Erro:", error);
    }

}