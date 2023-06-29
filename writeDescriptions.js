require('./controllers');
const fs = require('fs/promises');

function writeAtricleById() {
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

function writeCommentsById (){
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
module.exports = {writeAtricleById, writeCommentsById}