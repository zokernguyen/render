const config = require('./utils/config');

const express = require('express');
require('express-async-errors');

const app = express();

const mongoose = require('mongoose');

const cors = require('cors');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const blogsRouter = require('./controllers/blogs');

mongoose.set('strictQuery', false);

console.log(config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch(error => logger.error('error connecting to MongoDB', error.message));

app.use(cors());
// app.use(express.static('dist'))
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;