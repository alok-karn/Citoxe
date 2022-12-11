const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
// const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const viewRouter = require('./routers/viewRoutes');
const userRouter = require('./routers/userRoutes');
const productRouter = require('./routers/productRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//Global Middlewares

// Set Security HTTP Headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again after an hour',
});

app.use('/api', limiter);

// Body Parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against XSS
app.use(xss());

app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
