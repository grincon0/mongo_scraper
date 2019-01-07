const express = require('express');
const axios = require('axios');

const db = require('../models/index');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const router = express.Router();


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('DATABASE CONNECTION SUCCESSFUL');
    })
    .catch((err) => {
        console.log('DATABASE NOT FOUND', err)
    });

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

router.get('/saved', (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            res.render('saved', { article: dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        });
})

router.get("/scrape", function (req, res) {
    axios.get("https://www.space.com/search-for-life").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".search-item").each(function (i, elem) {
            let result = {};

            result.title = $(elem).find(".list-text a").text();
            result.summary = $(elem).find("a img").attr("alt");
            result.link = $(elem).find(".list-text a").attr("href");
            result.photo = $(elem).find("a img").attr("src");

            console.log(result);

            db.Article.findOne({ title: result.title })
                .then((dbArticle) => {

                    if (dbArticle) {
                        console.log("Deplicate Article...Skipping.");
                    } else {
                        db.Article.create(result)
                            .then((dbArticle) => {

                                console.log(dbArticle);
                            })
                            .catch((err) => {

                                return res.json(err);
                            });
                    }
                })
                .catch((err) => {

                    res.json(err);
                });
        });
    });
    res.redirect('/home');
})



router.post('/update/:id/:bool', (req, res) => {
    console.log(req.params);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: req.params.bool }).then(function (dbArticle) {

        //res.json(dbArticle);
        //res.sendStatus(200);
        location.reload();
        console.log('saved');
    }).catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
        console.log('nallls');
    });

});


router.post("/articles/:id", function (req, res) {

    console.log(req.body);
    db.Note.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

router.get("/notes/:id", function (req, res) {


    db.Article.findOne({ _id: req.params.id })

        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);


        })
        .catch(function (err) {

            res.json(err);
        });
});

router.delete('/notes/:id', function (req, res) {

    db.Note.findOneAndRemove({ _id: req.params.id }).then(function (data) {
        res.json(data);
    }).catch(function (err) {

        res.json(err);
    });


});

module.exports = router;
