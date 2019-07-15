const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");

exports.init = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
};

exports.send = (data, token) => {
    let message = {
        token,
        data
    };

    return admin.messaging().send(message);
};