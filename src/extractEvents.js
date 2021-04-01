const { get } = require('./firestore');

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

function mergeRow(group, limit = 0) {
    let copy = [];
    let temp = null;
    const size = (56.67 - 54.955) / 6;
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
    try {
        let regex = /(V\d+)\s-\s(T\d+)/;
        let regexTitle = new RegExp(event.title.join('|'), 'i');
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

        let pageviewRegex = new RegExp([event.title[1]], 'i');
        groups = groups.map(group => mergeRow(group));
        let index = groups.findIndex(group => group.length > 1 && (pageviewRegex.test(group[0].text) || /pag/i.test(group[1].text)));
        index = index === -1 ? 0 : index;
        let page = groups.slice(index).sort((a, b) => a[0].x - b[0].x);

        let events = [],
            e = [];

        for (let item of page) {
            if (item.length == event.numParams) {

                item = {
                    key: item[event.key].text,
                    value: item[event.value].text,
                    x: item[event.key].x,
                    y: item[event.key].y,
                };
            } else if (item.length == customDimension.numParams) {
                item = {
                    key: item[customDimension.key].text,
                    value: item[customDimension.value].text,
                    x: item[customDimension.key].x,
                    y: item[customDimension.key].y,
                };
            } else continue;

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
        //console.log("=========",events, "=============");
        return { info, events };
    } catch (error) {
        console.error(error);
        publishAlert({
            jobId: "",
            code: 504,
            message: "Erro ao estruturar a lista de eventos.",
            document: nomeMapa,
            page: pageNumber,
            version: '-'
        });
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
