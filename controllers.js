const { selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId, createComments, updateArticle, deletingComment, selectUsers } = require('./models');
const endpointsFile = require('./endpoints.json');
const { describeAtricleById, describeCommentsById, describePostingCommentsById, describeUpdatingArticlesById, describeDeletingCommentsById, describeGetApiUsers, getApiArticlesQueries } = require('./writeDescriptions');

const getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

const getApiEndPoints = (req, res, next) => {
    res.status(200).send(endpointsFile);
}

const getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    const {comment_count} = req.query;
    selectArticlesById(article_id, comment_count)
    .then((article) => {
        describeAtricleById();
        res.status(200).send({article});
    })
    .catch(next);
}

const getArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query;

    selectArticles(topic, sort_by, order)
    .then((articles) => {
        getApiArticlesQueries();
        res.status(200).send({articles});
    })
    .catch(next);
}

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        describeCommentsById();
        res.status(200).send({comments});
    })
    .catch(next);
}

const postComments = (req, res, next) => {
    const {username, body} = req.body;
    const {article_id} = req.params;

    if(typeof req.body.body !== 'string' && req.body.body !== null){
        return Promise.reject({ status: 400, msg: "Bad request. Data exception Error" }).catch(next);
    }else if(Object.keys(req.body).length > 2){
        return Promise.reject({ status: 200, msg: "Not Updated any record. Data input exception Error. Additional arguments are not allowed."}).catch(next);
    }
    createComments(username, body, article_id)
    .then((comment) => {
        describePostingCommentsById();
        res.status(201).send({comment});
    })
    .catch(next);
}

const patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    if(!Number.isFinite(+article_id))
        return Promise.reject({status:400, msg:"Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation "}).catch(next);
    
    updateArticle(article_id, inc_votes)
    .then((article) => {
        describeUpdatingArticlesById();
        res.status(201).send({article});
    })
    .catch(next);
}

const deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    if(!Number.isFinite(+comment_id))
        return Promise.reject({status:400, msg:"Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation "}).catch(next);
    
    deletingComment(comment_id)
    .then(() => {
        describeDeletingCommentsById();
        res.status(204).send();
    })
    .catch(next);
}

const getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        describeGetApiUsers();
        res.status(200).send({users});
    })
    .catch(next);
}

module.exports = {getTopics, getApiEndPoints, getArticlesById, getArticles, getCommentsByArticleId, postComments, patchArticle, deleteComment, getUsers};
