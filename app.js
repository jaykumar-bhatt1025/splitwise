import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import session from 'express-session';

import routes from './src/routes/index';

dotenv.config();
require('./src/config/sequelize');

const app = express();

app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(`${__dirname}/src/public`));
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());
app.use(
  session({
    secret: 'ansinsiniweo',
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
  }),
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

module.exports = app;
