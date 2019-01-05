const express = require('express');

const axios = require('axios');

const db = require('../models/index');

const cheerio = require('cheerio');

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
                    /*  return res.json(err); */
                });

        })

    }).then(function (res) {
        console.log(res);
    });

});

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
    // Create a new note and pass the req.body to the entry
    console.log(req.body);
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
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
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);

        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.delete('/notes/:id', function (req, res) {
    
    db.Note.findOneAndRemove({ _id: req.params.id }).then(function(data){
        res.json(data);
    }).catch(function (err) {
     
        res.json(err);
    });
        

});

module.exports = router;
