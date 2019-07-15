const nodeSchedule = require("node-schedule");
const schedule = require("./schedule");
const task = require("./task");
const user = require("./user");
const firebase = require("./firebase");
const moment = require("moment");
const helpers = require("../common/helpers");

exports.init = () => {
    let rule = new nodeSchedule.RecurrenceRule();
    rule.hour = 0;

    nodeSchedule.scheduleJob(rule, prepareTasksForDay);

    prepareTasksForDay();
};

const prepareTasksForDay = () => {
    schedule.getAllForToday()
        .then(result => {
            for (let item of result) {
                nodeSchedule.scheduleJob(new Date(item.startAt), function () {
                    doJob(item);
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
};

const doJob = (scheduleInfo) => {
    task.getById(scheduleInfo.taskId)
        .then(taskResult => {
            let provider = helpers.getProviderService(taskResult.provider);

            return new Promise((resolve, reject) => {
                provider.search(taskResult.target)
                    .then(item => {
                        if (moment(item.snippet.publishedAt).valueOf() > taskResult.lastPublished) {
                            return {
                                userId: taskResult.userId,
                                taskId: taskResult._id.toString(),
                                publishedAt: moment(item.snippet.publishedAt).valueOf(),
                                data: helpers.parseData(taskResult.provider, item)
                            }
                        }

                        return null;
                    })
                    .catch(error => reject(error));
            });
        })
        .then(result => {
            if (result.userId) {
                user.getById(result.userId)
                    .then(userInfo => {
                        firebase.send(result.data, userInfo.fireBaseToken);
                    });

                task.updatePublish(result.taskId, result.publishedAt)
            }
        })
        .catch(error => {
            console.log(error);
        });

    scheduleInfo.startAt += scheduleInfo.repeatTime;
    schedule.update(scheduleInfo._id.toString(), scheduleInfo);
};