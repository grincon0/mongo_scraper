const express = require('express');

const axios = require('axios');

const db = require('../models/index');

const cheerio = require('cheerio');

const mongoose = require('mongoose');
const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('/home');
});

router.get('/home', (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render('index', { article: dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/scrape", function () {
    axios.get("https://www.spriters-resource.com/").then(function (response) {

        let $ = cheerio.load(response.data);

        $("div.updatesheeticons").each(function (i, elem) {
            let result = {};

            result.title = $(elem).children("a").text();
            result.link = $(elem).children("a").attr("href");


            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });

        })

    }).then(function(res){
       console.log(res);
    });
    
});


module.exports = router;
