const fs = require('fs');
const util = require('util');
const onHeaders = require('on-headers');

const config = require('../config');
const Log = require('../models/log');

const colors = {
  danger: '\033[31m',
  info: '\033[32m',
  reset: '\033[0m',
  vivid: '\033[30;48;5;82m',
  highlight: '\033[92m',
  low: '\033[95m'
};

function recordLog (prod, state, label, message) {
  if (prod) {
    const log = new Log;
    log.add(state, label, message);
    log.save();
  }
}
function colourise (colourCode, string) {
  // eslint-disable-next-line prefer-template
  return '\033[' + colourCode + string + '\033[0m';
}

function printLog (color = '\033[0m', message) {
  process.stdout.write(colourise(color, `${message}\n`));
}

function startTimeTrace (label) {
  if (!process.loggerTimeTrace) {process.loggerTimeTrace = [''];}
  process.loggerTimeTrace.push({ label, time: new Date().getTime() });
}

function endTimeTrace (label) {
  const sLabel = process.loggerTimeTrace.find(x => x.label === label);
  if (sLabel) {
    const tt = sLabel.time;
    printLog(colors.low, `${label} : ${(new Date().getTime()) - tt} ms`);
    process.loggerTimeTrace = process.loggerTimeTrace.filter(x => x.label !== label);
  }
}

module.exports = {
  dbConnection (mongoose) {

    // When successfully connected
    mongoose.connection.on('connected', function () {
      console.log(`Mongoose default connection open to ${ config.dbURI}`);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
      console.log(`Mongoose default connection error: ${ err}`);
      console.log('=> if using local mongodb: make sure that mongo server is running \n' +
                '=> if using online mongodb: check your internet connection \n');
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });
  },

  trace (state = 'info', label, message, prod = false) {
    printLog(colors[state], `[${state}] [${label.toUpperCase()}] : ${message}`);
    console.log(message);
    recordLog(prod, state, label, message);
  },

  startTimeTrace,
  endTimeTrace,

  routeTime (prod = false) {
    return function (req, res, next) {
      const t = `[${req.method}] ${req.url}`;
      startTimeTrace(t);
      onHeaders(res, function () {endTimeTrace(t);});
      next();
    };
  },

  logInternalError (prod = false) {
    return function (req, res, next) {
      onHeaders(res, function () {
        if (parseInt(res.statusCode) === 500) {
          fs.writeFile('./logs/log.json', util.inspect(res), 'utf8', function () {});
          recordLog(true, 'danger', res.statusMessage, JSON.stringify({
            url: res.url,
            method: res.method,
            params: res.params
          }));

        }
      });
      next();

    };
  }
};