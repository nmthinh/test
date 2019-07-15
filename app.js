var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodeSchedule = require("node-schedule");
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://admin:admin123@ds157493.mlab.com:57493/microservice", {useNewUrlParser: true } )
        .then(client => {
            client.db("microservice");
            console.log("Connected successfully to server");
        });

let rule = new nodeSchedule.RecurrenceRule();

rule.hour = 16;
nodeSchedule.scheduleJob(rule, function(){
	MongoClient.connect("mongodb://admin:admin123@ds157493.mlab.com:57493/microservice", {useNewUrlParser: true } )
        .then(client => {
            client.db(microservice).collection("log").insertOne({
				job: "schedule rule",
				at: new Date()
			});
        });
});
	
nodeSchedule.scheduleJob(new Date("2019-07-15T08:55:26.112Z"), function(){
	MongoClient.connect("mongodb://admin:admin123@ds157493.mlab.com:57493/microservice", {useNewUrlParser: true } )
        .then(client => {
            client.db("microservice").collection("log").insertOne({
				job: "schedule rule",
				at: new Date()
			});
        });
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
