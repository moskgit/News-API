const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsFile = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(()=> db.end());

describe("GET /api/topics", () => {
  test("200: respond with JSON object of all topics", () => {
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
  test("200: respond with JSON object of all /api/ endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: respond with JSON object of all /api/articles/:article_id endpoints", () => {
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

  test("400: respond with an error message if searched with wrong url. endpoint /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/xyz")
      .expect(400)
      .then(({ body }) => {
        const {article} = body;
        expect(body.msg).toEqual("Bad request. Please check what you're requesting and try again.");
      });
    });

    test("404: respond with JSON object of all /api/articles/:article_id endpoints", () => {
      return request(app)
        .get("/api/articles/1500")
        .expect(404)
        .then(({ body }) => {
          const {article} = body;
          expect(body.msg).toEqual("Record Not Found");
        });
    });
});

