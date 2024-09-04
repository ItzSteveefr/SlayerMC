const { readdirSync } = require('fs');
const path = require('path');

module.exports = async function (client) {
    const schemasDir = path.join(__dirname, '../schemas');
    client.schemas = {};

    readdirSync(schemasDir).forEach(file => {
        if (file.endsWith('.js')) {
            const schemaName = file.split('.')[0];
            client.schemas[schemaName] = require(path.join(schemasDir, file));
        }
    });
    client.logs.database('Schemas Loaded!');
};
