const cors = require('cors')
const express = require("express");
const { getTopics, getApiEndPoints, getArticlesById, getArticles, getCommentsByArticleId, postComments, patchArticle, deleteComment, getUsers, getUserByUsername } = require('./controllers.js');
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors');

const app = express();

app.use(cors());

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

app.get('/api/users/:username', getUserByUsername);

app.all('*', (_, res) => {
    res.status(400).send({msg:"Bad request. Please check what you're requesting and try again."});
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

//add .listen is placed here to be used by the develooper.
// app.listen(8080, () => console.log(`Listening on 8080...`));

module.exports = app;