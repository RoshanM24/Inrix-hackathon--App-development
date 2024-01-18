require('dotenv/config');
const express = require('express');
const app = express();
const moment = require('moment-timezone');
const morgan = require('morgan');
const path = require('path');
const db = require('./connection');
const CustomError = require('./bin/custom/error');
const cors = require("cors")

try {
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback() {
    console.log('Successfully Connected to DB!!!');
  });
} catch (error) {
  console.log(error);
}


//******* Associations ******\\

const { InrixTokenChron } = require('./bin/controllers/chronjob');

//******* SETTING CORS HEADER *******\\
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

//******* HIDING EXPRESS *******\\
app.set('x-powered-by', false);
app.use(function (req, res, next) {
  res.header('Efforts', ':)');
  next();
});

//******* MIDDLEWARES *******\\
app.use(
  morgan(function (tokens, req, res) {
    let dates = moment.tz(Date.now(), 'Asia/Kolkata').toString().split(' ');
    return [
      req.headers.ip,
      dates[2] + dates[1].toUpperCase() + dates[3].slice(-2),
      dates[4],
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  })
);
app.use(express.json());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true, limit: '100mb' }));
app.use(require('body-parser').json({ limit: '100mb' }));

//******* CHRONJOBX *******\\

// const { InrixTokenChron } = require('./bin/controllers/chronjob');

//******* IMPORTING THE ROUTES *******\\

const AuthRoutes = require('./bin/routes/auth');
const InrixRoutes = require('./bin/routes/inrix');
const { sendRequest } = require('./bin/custom/auxiliary');


//******* USING THE ROUTES *******\\

app.use('/auth',AuthRoutes);
app.use('/inrix',InrixRoutes);


//******* ERROR HANDLING *******\\
app.use((req, res, next) => {
  const error = new CustomError(
    'Not Found!',
    `Uh oh! the path you are trying to reach we can't find it, we've checked each an every corner!`,
    404
  );
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    success: false,
    details: error,
  });
});

module.exports = app;


async function InrixAPI(){
  const url = `${process.env.INRIX_API}auth/v1/appToken?appId=${process.env.INRIX_APP_ID}&hashToken=${process.env.INRIX_HASH_TOKEN}`
  const res =  await sendRequest({},{},url,"GET");
  global.inrixtoken = res.result.token
}
InrixAPI()