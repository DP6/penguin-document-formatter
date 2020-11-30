const config_file = require('./config.json');

exports.extractEvents = extractEventsFromJson;
function extractEventsFromJson(content, config = config_file) {
    let pages = JSON.parse(content);
    let groups = groupTexts(pages);
    let { info, events } = groupEvents(groups, config);
    return { info, events };
}

function groupTexts(texts, limitX = 20, limitY = 0.05) {
    let groups = [];
    //em y
    let group = [];
    let actual, previous;

    for (let i = 0; i < texts.length; i++) {
        actual = texts[i];
        if (i == 0 || group.length == 0) {
            group.push(actual);
            previous = actual;
            continue;
        } else {
            if (
                actual.y - previous.y <= limitY &&
                actual.x - previous.x <= limitX
            ) {
                group.push(actual);
            } else {
                groups.push(group);
                group = [actual];
                previous = actual;
                if (i == texts.length - 1 || i == texts.length - 2) groups.push(group);
                continue;
            }

        }
    }

    return groups;
}

function groupEvents(groups, { event, customDimension }) {
    let regex = /(V\d+)\s-\s(T\d+)/;
    let regexTitle = new RegExp(event.title.join('|'), 'i');
    let pagina = groups[0][0].text || '';
    let infos_mapa = null;
    groups.forEach(
        (group) => group.forEach(
            (item) => {
                if (regex.test(item.text)) infos_mapa = item.text
            }
        )
    )
    let [, versao, tela] = infos_mapa != null ? infos_mapa.match(regex)
        : [0, 'VX', 'TX'];

    let info = {
        page: pagina,
        version: versao,
        screen: tela,
    };
    if (versao == 'VX') return { info, events: [] };
    let page = groups.slice(2).sort((a, b) => a[0].x - b[0].x);

    let events = [],
        e = [];

    for (item of page) {
        if (item.length == event.numParams) {

            item = {
                key: item[event.key].text,
                value: item[event.value].text,
                x: item[event.key].x,
                y: item[event.key].y,
            };
        }
        else if (item.length == customDimension.numParams)
            item = {
                key: item[customDimension.key].text,
                value: item[customDimension.value].text,
                x: item[event.key].x,
                y: item[event.key].y,
            };
        else continue;

        if (regexTitle.test(item.key)) {
            e = [];
            if (page.indexOf(item) != 0) events.push(e);
            //else if (events.length == 0) events.push(item);
        }

        if (customDimension.title.indexOf(item.key) == -1) e.push(item);
    }

    events = events
        .sort((a, b) => a[0].y - b[0].y)
        .map((item) =>
            item.map(({ key, value }) => {
                return { key, value };
            })
        );
    if (events.length > 0) {
        events.map((event, i) => event.map((item, j) => {
            if (i != 0 && item.key == "Pageview:")
                console.log('oi', item)
        }
        ))
    }
    //console.log("=========",events, "=============");
    return { info, events };
}

//array = [array[index], ...array.slice(0, index), ...array.slice(index + 1, array.length)]