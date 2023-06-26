const { selectTopics } = require('./models');

const getTopics = (req, res, next) => {

    //Get endpoint
    let endpoint = req.url.split('/');
    endpoint = endpoint[endpoint.length - 1];
    
    //Get data if the endpoint is as expected or handle the error
    if(endpoint === 'topics'){
        selectTopics(endpoint)
        .then((topics) => {
            res.status(200).send({topics});
        })
        .catch(next);
    }else next();
}


//exporting to app.js mainly
module.exports = {getTopics};