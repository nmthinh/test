const db = require("./database");
const moment = require("moment");
const ObjectID = require('mongodb').ObjectID;

exports.create = (scheduleArray) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").insertMany(scheduleArray)
            .then(result => resolve(result.insertedId))
            .catch(err => reject(err))
    })
};

exports.update = (id, info) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").updateOne({
            _id: ObjectID(id)
        }, {
            $set: {
                startAt: info.startAt,
                repeatTime: info.repeatTime
            }
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.deleteById = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").deleteOne({
            _id: ObjectID(id)
        })
            .then(schedule => resolve(schedule.taskId))
            .catch(err => reject(err))
    })
};

exports.deleteByTaskId = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").delete({
            taskId: ObjectID(id)
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.getAllByTaskId = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").find({
            taskId: ObjectID(id)
        })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};

exports.getAllForToday = () => {
    return new Promise((resolve, reject) => {
        db.instance.collection("schedule").find({
            startAt: {
                $gte: moment().startOf("day").valueOf(),
                $lte: moment().endOf("day").valueOf()
            }
        })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};