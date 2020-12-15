const config_file = require('./config.json');

exports.extractEvents = extractEventsFromJson;
function extractEventsFromJson(content, pageNumber, config = config_file) {
    let pages = JSON.parse(content);
    let groups = groupTexts(pages);
    let { info, events } = groupEvents(groups, pageNumber, config);
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

function mergeRow(group, limit = 0) {
    let copy = [];
    let temp = null;
    const size = (56.67 - 54.955) / 6;
    for (i in group) {
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

function groupEvents(groups, pageNumber, { event, customDimension }) {
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
        pageNumber: pageNumber,
        version: versao,
        screen: tela,
    };
    if (versao == 'VX') return { info, events: [] };
    
    var indx = 0; 
    for(var x of groups){
        if(x[0].text == "Pageview:"){
            break;
        }else{
            indx++
        }
    }
    let page = groups.slice(indx).sort((a, b) => a[0].x - b[0].x);
    page = page.map(group => mergeRow(group));
    
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
        }else continue;

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
}

//array = [array[index], ...array.slice(0, index), ...array.slice(index + 1, array.length)]
