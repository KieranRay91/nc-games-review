const request = require("supertest");
const app = require("../app/app");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");


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
