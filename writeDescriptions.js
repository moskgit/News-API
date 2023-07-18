require('./controllers');
const fs = require('fs/promises');

function describeAtricleById() {
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["GET /api/articles/:article_id"] = {
            "description": "serves the requested article in a descending order by the date it's created.",
            "queries": [],
            "exampleResponse": {
            "article":[{
            "article_id": 1,
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "author": "butter_bridge",
            "body": "I find this existence challenging",
            "created_at": "2020-07-09T20:11:00.000Z",
            "votes": 100,
            "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }]
            }
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

function describeCommentsById (){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["GET /api/articles/:article_id/comments"] = {
            "description": "serves the requested comments of the requested article ID in a descending order by the date it's created. (i.e.-Most recent comments first)",
            "queries": [],
            "exampleResponse": {
            "article":[{
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '11'
                }]
            }
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

function describePostingCommentsById (){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["POST /api/articles/:article_id/comments"] = {
            "description": "Creates new the comments for the given article_id. and displays newly created record.",
            "queries": [],
            "exampleResponse": {
            "comment":[{
                comment_id: 19,
                body: 'Comments...',
                article_id: 1,
                author: 'lurker',
                votes: 1,
                created_at: '2023-06-30T00:28:55.205Z'
                }]
            }
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

function describeUpdatingArticlesById (){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["PATCH /api/articles/:article_id"] = {
            "description": "Alters 'votes' value of an article for the given article_id. and displays newly created record.",
            "queries": [],
            "exampleResponse": {
            "article":[{
                article_id: 6,
                title: 'A',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'Delicious tin of cat food',
                created_at: '2020-10-18T01:00:00.000Z',
                votes: -10,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                }]
            }
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

function describeDeletingCommentsById (){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["DELETE /api/comments/:comment_id"] = {
            "description": "Deletes a comment for given id from database, if exists",
            "queries": [],
            "exampleResponse": {}
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

function describeGetApiUsers(){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["GET /api/users"] = {
            "description": "Serves a list of all users.",
            "queries": [],
            "exampleResponse": {users: [
                {
                  username: 'butter_bridge',
                  name: 'jonny',
                  avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                  username: 'icellusedkars',
                  name: 'sam',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                }
              ]}
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}

//parametric endpoints | queries allowed
function describeGetApiArticlesQueries(){
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["GET /api/articles (queries)"] = {
            "description": "Serves with a filtered list of articles based on the query/queries.",
            "queries": ["topic=['cats','mitch','papers']", "sort_by=['author','title','article_id','created_at','votes','article_img_url']", "order=['ASC','DESC']"],
            "exampleResponse": {articles: [
                {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: '11'
                },
                {
                    author: 'icellusedkars',
                    title: 'Eight pug gifs that remind me of mitch',
                    article_id: 3,
                    topic: 'mitch',
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: '2'
                }
            ]}
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}


function describeUserByUsername() {
    fs.readFile('./endpoints.json', 'utf-8')
    .then((contents)=>{
        contents = JSON.parse(contents);
        contents["GET /api/users/:username"] = {
            "description": "serves the requested user searched by the username.",
            "queries": [],
            "exampleResponse": {
            "user":[{
                username: 'cooljmessy',
                name: 'Peter Messy',
                avatar_url: 'https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002'
              }]
            }
        }
        fs.writeFile('./endpoints.json', JSON.stringify(contents));
    })
}


module.exports = {describeAtricleById, describeCommentsById, describePostingCommentsById, describeUpdatingArticlesById, describeDeletingCommentsById, describeGetApiUsers, describeGetApiArticlesQueries, describeUserByUsername}