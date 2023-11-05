const User = require('../models/user');
const Blog = require('../models/user');
const jwt = require("jsonwebtoken");
const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('Status:  ', response.statusCode)
    logger.info('---')
    next()
};

const tokenExtractor = (req, res, next) => {
    const authHeader = req.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        req.token = authHeader.replace('Bearer ', '');
    } else {
        req.token = null;
    }

    next();
};

const userExtractor = async (req, res, next) => {
    let userId;

    if (req.params.id) {
        const blog = await Blog.findById(req.params.id);
        userId = blog.user.toString()
    } else if (req.get('authorization')) {
        const token = tokenExtractor(req, res, next);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        userId = decodedToken.id.toString();
    }

    req.user = await User.findById(userId);
    console.log(req.user);

    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
};