const mongoose = require('mongoose');

module.exports = async function (client) {
    client.logs.debug('Loading Database...');
    let url = client.config.MONGO_URL;

    if (!url) {
        client.logs.warn("No Database Found");
        return;
    }

    try {
        await mongoose.connect(url);
        
        if (mongoose.connection.readyState === 1) {
            client.logs.database('Database Connected');
        } else {
            client.logs.error('Database Connection Failed');
        }
    } catch (error) {
        if (error.message.includes('authentication failed')) {
            client.logs.error('Database Connection Error: Authentication failed. Please check your credentials.');
        } else {
            client.logs.error(`Database Connection Error: ${error.message}`);
        }
    }
}
