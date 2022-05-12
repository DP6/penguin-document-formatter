module.exports = {
    formatEvents,
    formatEnhancedEcommerce,
    formatDataLayer
};

function formatEvents(events, info) {
    try {
        const metadata = getMetadata(info);
        let [pageview, ...eventos] = events;
        const [, pagepath] = Object.values(pageview);
        pageview = [{
            pagename: pagepath,
            ...metadata
        }]
        eventos = eventos.filter(({ Evento: name }) => name == 'Interaction').map(({ Evento: eventType, ...params }) => {

            let { eventCategory, eventAction, eventLabel } = params

            return {
                eventType,
                eventCategory,
                eventAction,
                eventLabel,
                pagename: pagepath,
                ...metadata
            }
        });
        return { pageview, eventos };
    } catch (error) {
        console.error(error);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao formatar eventos de UA",
                payload: {
                    error: error.message
                }
            }
        );
    }
}

function formatEnhancedEcommerce(events, info) {
    try {
        const metadata = getMetadata(info);
        let [pageview, ...eventos] = events;
        const [, pagepath] = Object.values(pageview);
        const eec_events = ['promotionViews', 'promotionClicks', 'impressionViews', 'impressionClicks', 'productDetails', 'addToCart', 'checkout', 'removeFromCart', 'purchase'];
        let ecommerce = eventos.filter(
            ({ Evento: name }) => eec_events.includes(name))
            .map(({ Evento: eventType, ...params }) => {

                delete params.eventAction;
                delete params.eventCategory;
                delete params.eventLabel;

                // Exclui parâmetros pegos errôneamente do pdf
                let fineKeys = ['Evento', 'virtualPageview', 'eventCategory', 'eventAction', 'eventLabel', 'id', 'name', 'category', 'list', 'position', 'price', 'brand', 'availability', 'pagePath', 'pageCategory', 'pageType', 'userId', 'email', 'clientType', 'namePromotion', 'namePromocao', 'nameBanner', 'step', 'item_id', 'item_name', 'creative_name'];
                for (let key in params) {
                    if (!fineKeys.includes(key)) {
                        delete params[key];
                    }
                }

                return {
                    eventType,
                    ...params,
                    pagename: pagepath,
                    ...metadata
                }
            });
        return { ecommerce };
    } catch (error) {
        console.error(error);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao formatar eventos de UA",
                payload: {
                    error: error.message
                }
            }
        );
    }
}

function formatDataLayer(events, info) {
    try {
        const metadata = getMetadata(info);
        let [pageview, ...eventos] = events;
        const [, pagepath] = Object.values(pageview);
        const eec_events = ['pageInfo', 'userInfo'];
        let datalayer = eventos.filter(
            ({ Evento: name }) => eec_events.includes(name))
            .map(({ Evento: eventType, ...params }) => {

                delete params.eventAction;
                delete params.eventCategory;
                delete params.eventLabel;

                // Exclui parâmetros pegos errôneamente do pdf
                let fineKeys = ['Evento', 'virtualPageview', 'eventCategory', 'eventAction', 'eventLabel', 'id', 'name', 'category', 'list', 'position', 'price', 'brand', 'availability', 'pagePath', 'pageCategory', 'pageType', 'userId', 'email', 'clientType', 'namePromotion', 'namePromocao', 'nameBanner', 'step', 'item_id', 'item_name', 'creative_name'];
                for (let key in params) {
                    if (!fineKeys.includes(key)) {
                        delete params[key];
                    }
                }

                return {
                    eventType,
                    ...params,
                    pagename: pagepath,
                    ...metadata
                }
            });
        return { datalayer };
    } catch (error) {
        console.error(error);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao formatar eventos de UA",
                payload: {
                    error: error.message
                }
            }
        );
    }
}

function getMetadata(info) {
    const { version: versao, screen: tela,
        pageNumber: pagina_mapa, name: nome_mapa } = info;
    return {
        versao, tela, pagina_mapa, nome_mapa
    }
}