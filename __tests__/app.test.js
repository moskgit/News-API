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
