const { selectTopics } = require('./models');

const getTopics = (req, res, next) => {
    const topics = 'topics';
    selectTopics(topics)
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}


//exporting to app.js mainly
module.exports = {getTopics};