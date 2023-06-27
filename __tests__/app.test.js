const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(()=> db.end());

describe("GET /api/topics", () => {
  test("200: respond with JSON object of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topics) => {
          expect(topics).toHaveProperty("description", expect.any(String));
          expect(topics).toHaveProperty("slug", expect.any(String));
        });
      });
  });

});
