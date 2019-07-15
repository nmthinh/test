const db = require("./database");
const ObjectID = require('mongodb').ObjectID;

exports.create = ({ target, where, provider, lastPublished, userId }) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").insertOne({
            target: target,
            where: where,
            provider: provider,
            lastPublished: lastPublished,
            schedules: [],
            userId: ObjectID(userId)
        })
            .then(result => resolve(result.insertedId))
            .catch(err => reject(err))
    })
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").deleteOne({
            _id: ObjectID(id)
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.setScheduleIds = (taskId, scheduleIds) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").updateOne({
            _id: id
        }, {
            $set: {
                schedules: scheduleIds,
            }
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.update = (id, info) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").updateOne({
            _id: ObjectID(id)
        }, {
            $set: {
                target: info.target,
                where: info.where,
                provider: info.provider
            }
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.updatePublish = (id, publishedAt) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").updateOne({
            _id: ObjectID(id)
        }, {
            $set: {
                lastPublished: publishedAt,
            }
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
};

exports.addSchedule = (taskId, scheduleId) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task")
            .findOne({ _id: ObjectID(taskId) })
            .then(task => {
                task.schedules.push(scheduleId);

                return db.instance.collection("task")
                    .updateOne({
                        _id: ObjectID(taskId)
                    },{
                        $set: {
                            schedules: task.schedules
                        }
                    })
            })
            .then(() => resolve(scheduleId))
            .catch(error => reject(error))
    })
};

exports.removeSchedule = (taskId, scheduleId) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task")
            .findOne({ _id: ObjectID(taskId) })
            .then(task => {
                let index = task.schedules.indexOf(scheduleId);
                if (index > -1) {
                    task.schedules.splice(index, 1);
                }

                return db.instance.collection("task")
                    .updateOne({
                        _id: ObjectID(taskId)
                    },{
                        $set: {
                            schedules: task.schedules
                        }
                    })
            })
            .then(() => resolve())
            .catch(error => reject(error))
    })
};

exports.getAllByUserId = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").find({
            userId: ObjectID(id)
        })
            .toArray()
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};

exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.instance.collection("task").findOne({
            _id: ObjectID(id)
        })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
};