const fs = require('fs');

exports.saveFile = function (name, data) {
    try {
        //console.log('Salvando o arquivo', name);

        // Exclui parâmetros pegos errôneamente do pdf
        let fineKeys = ['Evento', 'virtualPageview', 'eventCategory', 'eventAction', 'eventLabel', 'id', 'name', 'category', 'list', 'position', 'price', 'brand', 'availability', 'pagePath', 'pageCategory', 'pageType', 'userId', 'email', 'clientType', 'namePromotion', 'namePromocao', 'nameBanner', 'step', 'item_id', 'item_name', 'creative_name'];
        data.events.forEach(event => {
            for (let key in event) {
                if (!fineKeys.includes(key)) {
                    delete event[key];
                }
            }
        });

        const file = fs.writeFileSync(name, JSON.stringify(data, null, 2), 'utf-8');
        return name;
    } catch (error) {
        console.error("Erro:", error);
    }

}