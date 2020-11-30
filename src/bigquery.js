const { BigQuery } = require('@google-cloud/bigquery');
const DATASET = "raft_suit",
    TABLE = "expected_events"
exports.insertRowsAsStream = insertRowsAsStream;

async function insertRowsAsStream(data) {
    const bigquery = new BigQuery();
    const rows = Array.isArray(data) ? data : [data];
    try {
        // Insert data into a table
        await bigquery
            .dataset(DATASET)
            .table(TABLE)
            .insert(rows);
        //console.info(`Inserted ${rows.length} rows`);
        return true;
    } catch (error) {
        console.error("Stargate: Erro ao inserir no bigquery");
        return error;
    }
}
