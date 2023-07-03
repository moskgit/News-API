const db = require('./db/connection');

function selectTopics() {
    return db.query('SELECT * FROM topics ;')
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Record Not Found" });
            }
            return rows;
        })
}

function selectArticlesById(articleId, comment_count = false) {
    const validCommentCount = [true, false];
    if(!validCommentCount.includes(comment_count) === true){
        return db.query (`SELECT count(comment_id) AS comment_count FROM comments 
            WHERE article_id = ${articleId} GROUP BY article_id;`)
            .then(({rows}) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Record Not Found" });
                }
                return rows;
            })
    }
        
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Record Not Found" });
        }
        return rows;
    });
}

function selectArticles(topic, sort_by = 'created_at', order = 'DESC') { 

    const validTopics = ['cats', 'mitch', 'paper'];
    const validSortBy = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url'];
    const validOrder = ['ASC', 'DESC'];

    let query = 
        `SELECT 
            a.author,
            a.title,
            a.article_id,
            a.topic,
            a.created_at,
            a.votes,
            a.article_img_url, 

        (SELECT count(comment_id) comment_count FROM comments 
        WHERE article_id = a.article_id GROUP BY article_id)

        FROM  articles a
        JOIN comments c ON a.article_id = c.article_id `;

    //     // console.log('(topic): ', (topic)?true:false);
    //     console.log('topic: ', topic);
    //     console.log('validTopics.includes(topic): ', validTopics.includes(topic));
    // if(topic){
    //     if(!validTopics.includes(topic) === false) {
    //         return Promise.reject({status:400, msg:"Bad request. Wrong search value."});
    //     }
    // }

    if(validTopics.includes(topic))
        query += `WHERE a.topic=${topic} `;
    if(validSortBy.includes(sort_by))
        query += `ORDER BY ${sort_by} `;
    if(validOrder.includes(order))
        query += order;

    return db.query(query)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not Found" });
            }
            return rows;
        });
}

function selectCommentsByArticleId(articleId) {
    return db.query(`
        SELECT 
            c.comment_id,
            c.votes,
            c.created_at,
            c.author,
            c.body,
            c.article_id
        FROM comments c 
            WHERE c.article_id = $1
            ORDER BY c.created_at DESC;`, [articleId]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            //check whether given article_id exists in the 'articles' table.
            return checkIfRecordExists(articleId)
            }
            return rows;
        });
    }
//used in ticket 06 above.
function checkIfRecordExists(article_id) {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return [];
    });
}
    
function createComments(author, body, article_id, votes = 0){
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "404 not found with a non-existent id - 4000 etc" });
        }else {
            return db.query(`INSERT INTO comments (body, article_id, author, votes, created_at) 
            VALUES ( $1, $2, $3, $4, $5 ) RETURNING *`, [body, article_id, author, votes, 'now()'])
        }
    })
    .then(({rows}) => {
        return rows;
    })
}

function updateArticle(article_id, inc_votes) {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "404: not found with a non-existent id - 5000 etc" });
        }else {
            return db.query(`UPDATE articles SET votes = ((SELECT votes FROM articles WHERE article_id = ${article_id}) + ${inc_votes}) WHERE article_id = ${article_id} RETURNING *;`)
        }
    })
    .then(({rows}) => {
        return rows;
    });
}

function deletingComment(comment_id) {
    return db.query('SELECT comment_id FROM comments WHERE comment_id = $1', [comment_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: not found with a non-existent id - 6000"})
        }
        return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    })
    .then(({rows}) => {
        return rows;
    });
}

function selectUsers(){
    return db.query('SELECT count(1) FROM users;')
    .then(({ rows }) => {
        if(+rows[0].count === 0) {
            return Promise.reject({ status: 404, msg: "Record Not Found" });
        }
        return db.query('SELECT * FROM users;');
    })
    .then(({rows}) => {
        return rows;
    });
}


module.exports = { selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId, createComments, updateArticle, deletingComment, selectUsers };
