exports.formatEvents = formatEvents;

function formatEvents(events, info) {
    try {
        const metadata = getMetadata(info);
        let [pageview, ...eventos] = events;
        const [, pagepath] = Object.values(pageview);
        pageview = [{
            pagename: pagepath,
            ...metadata
        }]
        eventos = eventos.map(({ Evento: eventType, ...params }) => {

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
    }
}

function getMetadata(info) {
    const { version: versao, screen: tela,
        pageNumber: pagina_mapa, name: nome_mapa } = info;
    return {
        versao, tela, pagina_mapa, nome_mapa
    }
}