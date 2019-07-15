const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

exports.init = () => {
    MongoClient.connect(process.env.CONNECTION_URL, {useNewUrlParser: true } )
        .then(client => {
            module.exports.instance = client.db(process.env.DB_NAME);
            console.log("Connected successfully to server");
        });
};

exports.instance = null;