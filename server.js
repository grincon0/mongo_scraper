const express = require('express');
const exphbr = require('express-handlebars');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";