const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view-engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

// notify connection status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We're connected to WikiDB!");
});

// article schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Article model Class
const Article = mongoose.model('Article', articleSchema);


// chainable route methods
app.route("/articles")

//////////////////////////////////////////////////////////////////////REQUESTS FOR ALL ARTICLES////////////////////////////////////////////////////////////////////////////

.get(function(req, res) {
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added new Article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all articles");
        }
        else {
            res.send(err);
        }
    })
});

////////////////////////////////////////////////////////////////////REQUESTS FOR SPECIFIC ARTICLES//////////////////////////////////////////////////////////////////////////////

//Express.js params
app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send("No matching article was found.");
        }
    });
})

.put(function(req, res) {
    Article.update({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, {overwrite: true}, function(err) {
        if(!err) {
            res.send("Sucessfully updated article.")
        } else {
            res.send(err);
        }
    });
})

.patch(function(req, res) {
    Article.update({title: req.params.articleTitle}, {$set: req.body}, function(err) {
        if (!err){
            res.send("Successfully updated article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if(!err) {
            res.send("Successfully deleted article");
        } else {
            res.send(err);
        }
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});