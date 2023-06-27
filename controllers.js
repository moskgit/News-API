const { selectTopics, selectArticlesById } = require('./models');
const endpointsFile = require('./endpoints.json');

const getTopics = (req, res, next) => {
    const topics = 'topics';
    selectTopics(topics)
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

function getApiEndPoints (req, res, next){
    res.status(200).send(endpointsFile);
}

const getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticlesById(article_id)
    .then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next);
}

//exporting to app.js mainly
module.exports = {getTopics, getApiEndPoints, getArticlesById};