const express = require('express');
const exphbr = require('express-handlebars');

const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const axious = require('axios');
const cheerio = require('cheerio');

const app = express();

const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });