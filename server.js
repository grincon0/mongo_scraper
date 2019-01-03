const express = require('express');
const exphbr = require('express-handlebars');

const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const scrape = require('./controllers/scraper-controller');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

app.engine(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', scrape);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



app.listen(PORT, function (){
    console.log(`App listening on PORT:${PORT}`);

});