const express = require("express");

const { getTopics, getApiEndPoints, getArticlesById, getArticles, getCommentsByArticleId, postComments, patchArticle, deleteComment, getUsers } = require('./controllers.js');
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors');

const app = express();

app.use(express.json());

app.get('/', getApiEndPoints);

app.get('/api/', getApiEndPoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getArticles); //Queries are handled.

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComments);

app.patch('/api/articles/:article_id', patchArticle);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);

app.all('*', (_, res) => {
    res.status(400).send({msg:"Bad request. Please check what you're requesting and try again."});
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

//add .listen here to test locally.

module.exports = app;