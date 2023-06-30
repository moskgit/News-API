const express = require("express");
const { getTopics, getApiEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId, postComments } = require('./controllers.js');
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/', getApiEndPoints)

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComments);

app.all('*', (_, res) => {
    
    res.status(400).send({msg:"Bad request. Please check what you're requesting and try again."});
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
