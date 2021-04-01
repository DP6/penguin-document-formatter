const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function get(path) {
    try {
        const document = firestore.doc(path);
        const data = await document.get();
        return data.data();
    } catch (error) {
        console.error(error);
    }
}


async function set(path, data) {
    try {
        const document = firestore.doc(path);
        return await document.set(data);
    } catch (error) {
        console.error(error);
    }
}

async function update(path, data) {
    try {
        const document = firestore.doc(path);
        return await document.update(data);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    get, set, update
};