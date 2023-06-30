const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsFile = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(()=> db.end());

describe("GET /api/topics", () => {
  test("200: responds with JSON object of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topics) => {
          expect(topics).toHaveProperty("description", expect.any(String));
          expect(topics).toHaveProperty("slug", expect.any(String));
        });
        expect(topics).toHaveLength(3);
        expect(topics[0]).toEqual({ slug: 'mitch', description: 'The man, the Mitch, the legend' });
      });
  });

});

describe("GET /api/", () => {
  test("200: responds with JSON object of all /api/ endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with JSON object of all articles for a given article_id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const {article} = body;

        expect(article[0]).toHaveProperty("article_id", expect.any(Number));
        expect(article[0]).toHaveProperty("title", expect.any(String));
        expect(article[0]).toHaveProperty("topic", expect.any(String));
        expect(article[0]).toHaveProperty("author", expect.any(String));
        expect(article[0]).toHaveProperty("body", expect.any(String));
        expect(article[0]).toHaveProperty("created_at", expect.any(String));
        expect(article[0]).toHaveProperty("votes", expect.any(Number));
        expect(article[0]).toHaveProperty("article_img_url", expect.any(String));
        expect(article[0]).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
        
      });
  });

  test("400: responds with an error message if searched with wrong url. URL: /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/xyz")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toMatch("Data exception Error");
      });
    });

    test("404: responds with JSON object of all records of a given article_id", () => {
      return request(app)
        .get("/api/articles/1500")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Record Not Found");
        });
    });
});

describe("GET /api/articles", () => {
  test("200: responds with JSON object of all articles.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(articles).toHaveLength(18);
          if(article.article_id === 1){
          expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: '11'
          });
        }
      });
    });
  });

  test("200: responds with a JSON object of all articles SORTED IN A DESCENDING order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('created_at', { descending: true,});
      });
  });

  test("400: responds with an error message if searched with wrong url. URL: /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articl")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Please check what you're requesting and try again.");
      });
  });

  test("404: responds with empty JSON object.", () => {
    return request(app)
      .get("/api/articles/1500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Record Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with JSON object of the comments of a given article id.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body;
        comments.forEach(comment => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          if(comment.comment_id === 5){
            expect(comment).toEqual({
              comment_id: 5,
              votes: 0,
              created_at: '2020-11-03T21:00:00.000Z',
              author: 'icellusedkars',
              body: 'I hate streaming noses',
              article_id: 1
            });
          }
        }); //end of the forEach
      });
  });

  test("200: responds with JSON object of the comments of a given article id, SORTED BY MOST RECENT COMMENTS FIRST.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body;
        expect(comments).toBeSortedBy('created_at', { descending: true,});
      });
  });

  test("Status 200, valid ID, but has no comments responds with an empty array of comments.", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body;
        expect(comments).toEqual([]);
      });
  });

  test("400: responds with an error message if searched with wrong url. URL: /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api/articles/xyz/comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Please check what you're requesting and try again.");
      });
  });

  test("404: responds with JSON object of all /api/articles/:article_id/comments endpoints", () => {
    return request(app)
      .get("/api/articles/1500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
});

//07
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a JSON object of the comments of a given article id Which has been posted.", () => {
    const newComments = {username: 'lurker', body: 'Comments...'};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComments)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment[0];
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));

          expect(comment["votes"]).toEqual(0);
          expect(comment["author"]).toEqual('lurker');
          expect(comment["body"]).toEqual('Comments...');
      });
  });

  test("400: responds with an error message if there's a malfunction request, for example missing NOT NULL value/s.", () => {
  const newComments = {username: 1, body:null}; //Creating violation for the 'NOT NULL' column. Check errors.js for details.
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComments)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toMatch("Malfunction: Class 23 — Integrity Constraint Violation:")
      });
  });

  test("200: Additional arguments are not allowed.", () => {
  const newComments = {username: 1, body:'Comments...', votes: 'x'}; //Creating data exception error. votes should be an integer.
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComments)
        .expect(200)
        .then(({ body }) => {
            expect(body.msg).toMatch("Not Updated any record. Data input exception Error. Additional arguments are not allowed.")
        });
  });

  test("400 bad request with an invalid id - notanid etc", () => {
    const newComments = {username: 1, body:'Comments...'};
      return request(app)
        .post("/api/articles/'10'/comments")
        .send(newComments)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toMatch("Bad request. Data exception Error 22P02")
        });
  });

  test("404 not found with a non-existent id - 4000 etc", () => {
    const newComments = {username: 1, body:'Comments...'};
      return request(app)
        .post("/api/articles/1500/comments")
        .send(newComments)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("404 not found with a non-existent id - 4000 etc");
        });
  });

  test("404 not found - username does not exist in the database.", () => {
    const newComments = {username: 'bananas', body:'Comments...'};
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComments)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("404 not found - username does not exist in the database.");
        });
  });
});

// 400 bad request with an invalid id - notanid etc
// 404 not found with a non-existent id - 4000 etc
// 404 not found - username does not exist in the database (psql will throw it's own error for you to utilise)