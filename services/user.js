const db = require("./database");
const ObjectID = require('mongodb').ObjectID;

exports.create = ({ userName, password }) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("user").findOne({
            userName: userName
        })
            .then(result => {
                if (result) {
                    resolve(null)
                } else {
                    return db.instance.collection("user").insertOne({
                        userName: userName,
                        password: password
                    })
                }
            })
            .then(createResult => resolve(createResult.insertedId))
            .catch(err => reject(err))
    })
};

exports.setFireBaseToken = ({ userName, fireBaseToken }) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("user").updateOne({
            userName: userName
        }, {
            $set: {
                fireBaseToken: fireBaseToken
            }
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.deleteByUserName = (userName) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("user").deleteOne({
            userName: userName
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.getByUserName = (userName) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("user").findOne({
            userName: userName
        })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};

exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("user").findOne({
            _id: ObjectID(id)
        })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};