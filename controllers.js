const { selectTopics } = require('./models');
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

//exporting to app.js mainly
module.exports = {getTopics, getApiEndPoints};