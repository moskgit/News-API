const db = require('./db/connection');

function selectTopics(endpoint){
    return db.query('SELECT * FROM topics ;')
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:400, msg:"Bad request"});
        }
        return rows;
    }) 
}

function selectArticlesById(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status:404, msg:"Record Not Found"});
        }
        return rows;
    });
}


//exporting to contollers mainly
module.exports = {selectTopics, selectArticlesById};