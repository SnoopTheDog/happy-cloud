const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./routes/users');

const app = express();

app.use(helmet());
app.use(cors());

app.options('*', cors());

app.use(logger('dev'));
//authentication here
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', usersRouter);

module.exports = app;