const fs = require('fs');

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

exports.saveFile = function (name, data) {
    try {
        //console.log('Salvando o arquivo', name);

        // Exclui parâmetros pegos errôneamente do pdf
        let fineKeys = ['Evento', 'eventCategory', 'eventAction', 'eventLabel', 'screenName', 'id', 'name', 'category', 'list', 'position', 'price', 'brand', 'availability', 'namePromotion', 'nameBanner', 'step', 'item_id', 'item_name', 'item_category', 'item_brand', 'item_list', 'index', 'creative_name', 'creative_slot', 'store', 'shipping', 'revenue', 'coupon', 'shippingType', 'paymentType', 'quantity', 'index', 'checkout_step', 'transaction_id', 'affiliation', 'value', 'tax', 'item_list_name', 'accessAvailability', 'currency', 'content_type', 'virtualPageview', 'pagePath', 'pageCategory', 'pageType', 'userId', 'email', 'clientType', 'virtualPagePath'];
        data.events.forEach(event => {
            for (let key in event) {
                if (!fineKeys.includes(key) && !key.startsWith('dimension') &&
                    !fineKeys.includes(key.replace('transaction.', '').replace('products.', ''))) {
                    delete event[key];
                }
            }
        });

        // Exclui objetos vazios
        data.events = data.events.filter(obj => !isEmpty(obj))

        const file = fs.writeFileSync(name, JSON.stringify(data, null, 2), 'utf-8');
        return name;
    } catch (error) {
        console.error("Erro:", error);
    }

}