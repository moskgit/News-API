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
          expect(article).toHaveProperty("comment_count");
          expect(articles).toHaveLength(13);
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


//08
describe("PATCH /api/articles/:article_id", () => {
  test("201: Increment by 20: - article number 6 responds with a JSON object Which has been UPDATED, from the articles, matching the given article id.", () => {
    const newArticle = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/6")
      .send(newArticle)
      .expect(201)
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
          article_id: 6,
          title: 'A',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'Delicious tin of cat food',
          created_at: '2020-10-18T01:00:00.000Z',
          votes: 20,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
      });
  });

  test("201: Decrement by 10 - article number 6: responds with a JSON object Which has been UPDATED, from the articles, matching the given article id.", () => {
    const newArticle = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/6")
      .send(newArticle)
      .expect(201)
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
          article_id: 6,
          title: 'A',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'Delicious tin of cat food',
          created_at: '2020-10-18T01:00:00.000Z',
          votes: -10,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
      });
  });
    
  test("400: responds with an error message if there's a malfunction request, for example missing NOT NULL value.", () => {
    const newArticle = { inc_votes: null }; //Creating violation for the 'NOT NULL' column. Check errors.js for details.
    return request(app)
      .patch("/api/articles/6")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toMatch("Malfunction: Class 23 — Integrity Constraint Violation:")
      });
  });
    
  test("400: responds with an error message if there's an INCORRECT DATA TYPE in REQUEST BODY.", () => {
    const newComments = {inc_votes : 'xyz'}; // Creating Data exception error.
    return request(app)
      .patch("/api/articles/6")
      .send(newComments)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toMatch("Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation ")
      });
  });

  test("400: responds with an error message if REQUESTing article_id is NaN.", () => {
    const newComments = {inc_votes : 50};
    return request(app)
      .patch("/api/articles/'xyz'")
      .send(newComments)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toMatch("Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation ")
      });
  });

  test("404: responds with an error message if VALID article_id BUT NOT RESOURCE FOUND in the record.", () => {
    const newComments = {inc_votes : 50};
    return request(app)
      .patch("/api/articles/5000")
      .send(newComments)
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toMatch("404: not found with a non-existent id - 5000 etc");
      });
  });
});

//09
describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with a DELETED JSON object for the COMMENT ID.", () => {
    return request(app)
      .delete("/api/comments/18")
      .expect(204)
      .then(({body}) => {
        expect(body).toEqual({});
      });
  });
 
  test("400: responds with an error message if REQUESTing article_id is NaN.", () => {
    return request(app)
      .delete("/api/comments/'xyz")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toMatch("Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation ");
      });
  });

  test("404: responds with an error message if VALID article_id BUT NOT FOUND in the record.", () => {
    return request(app)
      .delete("/api/comments/6000")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toMatch("404: not found with a non-existent id - 6000");
      });
  });
});

//10
describe("GET /api/users", () => {
  test("200: responds with JSON object of all articles.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
          expect(users).toHaveLength(4);
          if(user.username === 'butter_bridge'){
          expect(user).toEqual({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          });
        }
      });
    });
  });

  test("400: responds with an error message if searched with wrong url.", () => {
    return request(app)
      .get("/api/use")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Please check what you're requesting and try again.");
      });
  });
//NOTE: The following test passes if the 'users' table is empty(i.e-if it holds no record but the table exists).
//To run the test, remove 'x' (the first character.)
  xtest("404: responds with an error message if there is no user. (i.e.-'users' table being empty.)", () => {
    return request(app)
      .get("/api/users")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Record Not Found");
      });
  });
});

//11
describe("GET /api/articles (queries)", () => {
  test.only("200: (TOPIC) responds with JSON object of all articles filtered by a topic searched for.", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
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
          expect(article).toHaveProperty("comment_count");
          expect(articles).toHaveLength(12);
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

  test("200: (SORT BY) responds with JSON object of all articles filtered by a topic searched for.", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
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
          expect(article).toHaveProperty("comment_count");
          expect(articles).toHaveLength(13);
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

  test("200: (ORDER=ASC/DESC) responds with JSON object of all articles filtered by a topic searched for.", () => {
    return request(app)
      .get("/api/articles?order=ASC")
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
          expect(article).toHaveProperty("comment_count");
          expect(articles).toHaveLength(13);
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

  test("404: WRONG 'topic' searched. responds with an error message if searched with wrong topic value.", () => {
    return request(app)
      .get("/api/articles?topic='xyz'")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Wrong query(search) value. Data does not exist.");
      });
  });

  test("404: WRONG 'sort_by' searched value. responds with an error message if searched with wrong sort_by value.", () => {
    return request(app)
      .get("/api/articles?sort_by='xyz'")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Wrong query(search) value. Data does not exist.");
      });
  });

  test("404: WRONG 'order' searched. responds with an error message if searched with wrong order value.", () => {
    return request(app)
      .get("/api/articles?order='xyz'")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request. Wrong query(search) value. Data does not exist.");
      });
  });

});

//12
describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: (COMMENT_COUNT = true) responds with JSON object of an article for the id that displays comment count.", () => {
    return request(app)
      .get("/api/articles/1?comment_count=true")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
          if(article.article_id === 1){
          expect(article).toEqual({ comment_count: '11' });
        }
    });
  });

  test("200: (COMMENT_COUNT = false) responds with JSON object of an article for the id that displays comment count.", () => {
    return request(app)
      .get("/api/articles/1?comment_count=false")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
          if(article.article_id === 1){
          expect(article).toEqual({ comment_count: '11' });
        }
    });
  });

  test("200: (COMMENT_COUNT = jkh) responds with JSON object of an article for the id that displays comment count.", () => {
    return request(app)
      .get("/api/articles/1?comment_count=jkh")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
          if(article.article_id === 1){
          expect(article).toEqual({ comment_count: '11' });
        }
    });
  });
});

