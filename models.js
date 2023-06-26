const db = require('./db/connection');

function selectTopics(endpoint){
    return db.query(`SELECT * FROM ${endpoint} ;`)
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:400, msg:"Bad request"});
        }
        return rows;
    }) 
}

//exporting to contollers mainly
module.exports = {selectTopics};