const { selectTopics, selectArticlesById, selectAllArticles, selectCommentsByArticleId, createComments } = require('./models');
const endpointsFile = require('./endpoints.json');
const { describeAtricleById, describeCommentsById, describePostingCommentsById } = require('./writeDescriptions');

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
    selectArticlesById(article_id)
    .then((article) => {
        describeAtricleById();
        res.status(200).send({article});
    })
    .catch(next);
}

const getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
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
        return Promise.reject({ status: 400, msg: "Bad request. Data exception Error" }).then().catch(next);
    }else if(Object.keys(req.body).length > 2){
        return Promise.reject({ status: 200, msg: "Not Updated any record. Data input exception Error. Additional arguments are not allowed."}).then().catch(next);
    }else{
        createComments(username, body, article_id)
        .then((comment) => {
            describePostingCommentsById();
            res.status(201).send({comment});
        })
        .catch(next);
    }
}


module.exports = {getTopics, getApiEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId, postComments};
