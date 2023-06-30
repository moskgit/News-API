require('./controllers');
const fs = require('fs/promises');

function describeAtricleById() {
    fs.readFile('./endpoints.json', 'utf-8')
        .then((contents)=>{
            contents = JSON.parse(contents);
            contents["GET /api/articles/:article_id"] = {
                "description": "serves the requested article in a descending order by the date it's created.",
                "queries": ["article_id"],
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
module.exports = {describeAtricleById, describeCommentsById, describePostingCommentsById}