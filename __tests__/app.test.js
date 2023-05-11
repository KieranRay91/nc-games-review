const request = require("supertest");
const app = require("../app/app");
const fs = require("fs/promises");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json")


beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe('/api/categories', () => {
    test('GET should respond with a status:200 and an object', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(typeof response.body).toBe('object')
        })
    });
    test('GET should respond with a status:200 and an object that has a value which is an array', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.categories)).toBe(true)
        })
    });
    test('GET should return an array of category objects, each of which should have the following properties: slug, description', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            response.body.categories.forEach((category) => {
                expect(typeof category.slug).toBe('string');
                expect(typeof category.description).toBe('string');
            })
        })
    });
});

describe("GET /api", () => {
    test("status:200 responds with an object containing all current endpoints", () => {
      return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe('object');
        expect(response.body).toStrictEqual(endpoints)
      })
    });
  });
  

