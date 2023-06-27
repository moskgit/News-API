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
        const {articles} = body;

        articles.forEach((articles) => {
          expect(articles).toHaveProperty("article_id", expect.any(Number));
          expect(articles).toHaveProperty("title", expect.any(String));
          expect(articles).toHaveProperty("topic", expect.any(String));
          expect(articles).toHaveProperty("author", expect.any(String));
          expect(articles).toHaveProperty("body", expect.any(String));
          expect(articles).toHaveProperty("created_at", expect.any(String));
          expect(articles).toHaveProperty("votes", expect.any(Number));
          expect(articles).toHaveProperty("article_img_url", expect.any(String));
        });
        expect(articles[0]).toEqual({
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
});

