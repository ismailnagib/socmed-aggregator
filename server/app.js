require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var cors = require('cors')
var path = require('path')
var logger = require('morgan')
const mongoose = require('mongoose')

var router = require('./routes/')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

mongoose.connect('mongodb://localhost:27017/socmed-aggregator', {useNewUrlParser: true});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
