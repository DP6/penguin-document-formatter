exports.formatEvents = formatEvents;

function formatEvents(events, info) {
    try {
        let pageview, eventos;

        pageview = events.filter((item) => /p[aá]g/i.test(item[0].key) || /p[aá]g/.test(item[0].value))
        pageview = pageview ? pageview[0] : pageview;
        let pageview_index = events.indexOf(pageview);
        if (pageview != undefined && pageview_index != -1)
            events.splice(pageview_index, 1);

        if (pageview != undefined && /event/i.test(pageview[0].key))
            pageview = pageview.filter(item => /p[aá]g/i.test(item.key))

        pageview = pageview && pageview.length > 0 ? pageview.map((item) => {
            return {
                pagename: item.value,
                versao: info.version,
                tela: info.screen,
                pagina_mapa: info.pageNumber,
                nome_mapa: info.name
            }
        }) : null;

        const pagePath = pageview[0].pagename;

        eventos = events.length > 0 ? events.map(([evento, category, action, label]) => {
            if (/event/i.test(evento.key)) {
                return {
                    eventType: evento.value,
                    eventCategory: category.value,
                    eventAction: action.value,
                    eventLabel: label.value,
                    pagename: pagePath,
                    versao: info.version,
                    tela: info.screen,
                    pagina_mapa: info.pageNumber,
                    nome_mapa: info.name
                }
            } else {
                return null;
            }
        }) : null;
        return { pageview, eventos };
    } catch (error) {
        console.error(error);
        publishAlert({
            jobId: "",
            code: 502,
            message: "Erro ao formatar eventos de UA.",
            document: info.name,
            page: info.pageNumber,
            version: info.version
        });
    }
}
