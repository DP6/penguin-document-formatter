const fs = require('fs');

exports.saveFile = function (name, data) {
    try {
        //console.log('Salvando o arquivo', name);

        // Exclui parâmetros pegos errôneamente do pdf
        let fineKeys = ['Evento', 'id', 'name', 'category', 'list', 'position', 'price', 'brand', 'availability', 'namePromotion', 'nameBanner', 'step', 'item_id', 'item_name', 'item_category', 'item_brand', 'item_list', 'creative_name', 'creative_slot', 'store', 'shipping', 'revenue', 'coupon', 'shippingType', 'paymentType', 'quantity', 'dimension3', 'dimension4', 'virtualPageview', 'pagePath', 'pageCategory', 'pageType', 'userId', 'email', 'clientType'];
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