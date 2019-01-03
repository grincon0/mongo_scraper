const express = require('express');
const router = express.Router();
const axios = require('axios');

const db = require('../models');


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
    axios.get("https://medium.freecodecamp.org/").then(function (res) {

        let $ = cheerio.load(response.data);

        $(".section-content h3").each(function (i, elem) {
            let result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");


            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });

        })

    })
    res.redirect('/home');
})

