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

function selectArticlesById(articleId) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Record Not Found" });
            }
            return rows;
        });
}

function selectAllArticles() {
    return db.query(`
        SELECT 
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
        JOIN comments c ON a.article_id = c.article_id 
        --WHERE a.article_id = 1
        ORDER BY created_at DESC;
    `)
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
                //Use queries to check what's giving an empty array, before explicitly rejecting.
                return checkWhatsGivingEmptyArray(articleId)
                }
                return rows;
            });
        }
        //used in ticket 06
        function checkWhatsGivingEmptyArray(article_id) {
            return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
            .then(({rows})=>{
                if(rows.length === 0){
                    return Promise.reject({ status: 404, msg: "Not Found" });
                }
                return [];});
        }
        
function createComments(author, body, article_id, votes){
    return db.query(`INSERT INTO comments (body, article_id, author, votes, created_at) 
    VALUES ( $1, $2, $3, $4, $5 ) RETURNING *`, [body, article_id, author, votes, 'now()'])
    .then(({rows}) => {
        return rows;
    })
}



module.exports = { selectTopics, selectArticlesById, selectAllArticles, selectCommentsByArticleId, createComments };
