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

module.exports = {writeAtricleById}