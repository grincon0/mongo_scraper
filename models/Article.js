const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    saved:{
        type: Boolean,
        default: false
    },
    //new changed to arry of objs
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;