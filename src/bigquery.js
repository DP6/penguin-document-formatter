const { BigQuery } = require('@google-cloud/bigquery');

let schemaExample = [
    {
        name: 'Column name',
        type: 'STRING',//INTEGER,FLOAT,BOOLEAN,RECORD,
        mode: 'REQUIRED' //opcional
    }
]

/**
 * Returns a bigquery dataset. If it doesn't exist, creates a new and then returns.
 * @param {String} datasetId 
 * @returns 
 */
async function getOrCreateDataset(datasetId) {
    const bq = new BigQuery();
    const dataset = bq.dataset(datasetId).get({ autoCreate: true });
    return dataset;

}


async function getOrCreateTable({ datasetId, tableName, schema }) {

    try {
        const dataset = await getOrCreateDataset(datasetId);

        const options = {
            schema,
            location: 'US',
            type: 'TABLE'
        };
        const table = dataset.table(tableName).get({
            autoCreate: true,
            ...options
        });
        return table;

    } catch (error) {
        console.error(`Error getting table ${tableName}:`, error);
        throw new Error(error);
    }
}

/**
 * Insert rows as stream at the given table and dataset.
 * @param {Array} rows - Array of objects that will be inserted
 * @param {*} datasetId 
 * @param {*} tableName 
 * @param {*} schema - Schema of the table, in case you need to create it.
 */
async function insertRowsAsStream(rows, datasetId, tableName, schema) {

    try {
        const table = getOrCreateTable({ datasetId, tableName, schema });
        await table.insert(JSON.stringify(rows));
        console.info(`Inserted ${rows.lenght} in ${tableId}`);
    } catch (error) {
        console.error(`Error inserting ${rows.lenght} in ${tableId}. \n`, error);
    }

}

exports = {
    getOrCreateTable,
    insertRowsAsStream
}