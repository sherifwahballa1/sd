const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');

const Config = require('./config');
const pjson = require('./package.json');
const Logger = require('./modules/logger.js');
const appCrons = require('./crons');
const appSeeds = require('./seed');
const Security = require('./security');
const { userAPI } = require('./components/user');
const { categoryAPI } = require('./components/category');
const { placeAPI } = require('./components/place');
const app = express();
const PORT = process.env.PORT || 3000;

// database connection
mongoose.connect(Config.dbURI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// cors
app.use(cors());
app.use(helmet({
  // over-ridden by masking
  hidePoweredBy: false
}));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logs db connection errors
Logger.dbConnection(mongoose);
// log the time taken in each request
app.use(Logger.routeTime());
app.use(morgan('tiny'));
app.use(Security.preventBlocked);

Security.masking(app);

// set port
app.set('port', PORT);

// passing routes
app.use('/api', userAPI);
app.use('/api', categoryAPI);
app.use('/api', placeAPI);
// activate all cron jobs
appCrons();

// seed the application with pre defined data
appSeeds();

if (Config.canUseCustomErrorPages) {
  // Handle 500
  app.use(function (error, req, res, next) {
    res.status(500).send({ title: '500: Internal Server Error', error });
  });

  // Handle 404
  app.use(function (req, res) {
    res.status(404).send({ title: '404: File Not Found' });
    Security.log404(req);
  });
}

app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) res.status(500).send(err.message);
  else next(err);
});

const server = require('http').createServer(app);
server.listen(app.get('port'), function () {
  console.log(` ################## ${pjson.name} \n ##################  ${Config.currentEnv}  \n ################## running on port : ${app.get('port')}`);
});