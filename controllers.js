const { selectTopics, selectArticlesById, selectAllArticles, selectCommentsByArticleId } = require('./models');
const endpointsFile = require('./endpoints.json');
const { writeAtricleById } = require('./writeDescriptions');

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
        writeAtricleById();
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
        res.status(200).send({comments});
    })
    .catch(next);
}


module.exports = {getTopics, getApiEndPoints, getArticlesById, getAllArticles, getCommentsByArticleId};