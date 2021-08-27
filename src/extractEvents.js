const { get } = require('./firestore');
const sendData = require('./hub');

exports.extractEvents = extractEventsFromJson;
async function extractEventsFromJson(content, pageNumber, nomeMapa, config = "") {
    try {
        if (config === "")
            config = await get("raft-suite/config");
        let pages = JSON.parse(content);
        let groups = groupTexts(pages);
        let { info, events } = groupEvents(groups, pageNumber, nomeMapa, config);
        return { info, events };
    } catch (error) {
        console.error(error);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao extrair eventos do JSON",
                payload: {
                    error: error
                }
            }
        );
    }
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
                Math.abs(actual.y - previous.y) <= limitY &&
                Math.abs(actual.x - previous.x) <= limitX
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

function mergeRow(group, limit = 0) {
    let copy = [];
    let temp = null;
    const size = (30.174 - 28.18) / 5;
    for (var i in group) {
        if (temp === null) temp = group[i];
        const item = temp;
        if (i == group.length - 1) {
            copy.push(item);
            temp = null;
            continue;
        }
        const j = +i + 1;
        const next = group[j];
        let dif = next.x - item.x - item.text.length * size;
        if (dif > limit) {
            copy.push(item);
            temp = null;
        }
        else {
            const concat = item.text + next.text;
            temp = { ...item, text: concat };
        }
    }
    return copy;
}

function groupEvents(groups, pageNumber, nomeMapa, { event, customDimension }) {

    let newConfig = {
        eventTitle: "Evento",
        pageviewTitle: "(page|screen)(name|view)?$",
        parameters: 2
    };

    try {
        let regex = /(V\d+)\s-\s(T\d+)/;
        let regexTitle = new RegExp(`^${newConfig.eventTitle}\$`, 'i');
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
        versao = formatDigits(versao);
        tela = formatDigits(tela);
        let info = {
            name: nomeMapa,
            pageNumber: pageNumber,
            version: versao,
            screen: tela,
        };
        if (versao == 'VX') return { info, events: [] };
        let pageviewRegex = new RegExp([newConfig.pageviewTitle], 'i');
        groups = groups.map(group => mergeRow(group))
            .filter(group => group.length == newConfig.parameters);

        let index = groups.findIndex(group =>
            group.length > 1 &&
            (pageviewRegex.test(group[0].text) ||
                pageviewRegex.test(group[1].text)));

        index = index === -1 ? 0 : index + 1;
        let page = groups.slice(index).sort((a, b) => a[0].x - b[0].x);
        let events = [], event = {};
        if (index > 0) {
            let [{ text: key }, { text: value }] = groups[index - 1];
            events.push(
                {
                    [newConfig.eventTitle]: /page/i.test(key) ? "page_view" : "screenView",
                    [key]: value
                }
            );
        }
        for (let item in page) {
            let [{ text: key }, { text: value }] = page[item];
            if ((item != 0 && regexTitle.test(key))) {
                events.push(event);
                event = {};
            }
            event[key] = value;
            if (item == page.length - 1 && regexTitle.test(Object.keys(event)[0])) events.push(event);
        }
        return { info, events };
    } catch (error) {
        console.error(error);
        sendData(
            {
                code: "01-01",
                spec: path,
                description: "Erro ao estruturar eventos do JSON",
                payload: {
                    error: error
                }
            }
        );
    }
}

//array = [array[index], ...array.slice(0, index), ...array.slice(index + 1, array.length)]

function formatDigits(text) {
    const r = /(\w)(\d{1,2})/;
    if (!r.test(text))
        return text
    let [letter, number] = text.match(r).slice(1);

    number = (+number).toLocaleString(undefined, { minimumIntegerDigits: 2 });
    return letter + number;
}
