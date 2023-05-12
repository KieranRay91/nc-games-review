const request = require("supertest");
const app = require("../app/app");
const fs = require("fs/promises");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json")
require("jest-sorted");

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
  

  describe("GET /api/reviews/:review_id", () => {
    test("status:200, responds with the specific requested review as an object, containing the appropriate properties", () => {
      return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        const expectedReview = {
            review_id: 1,
            title: 'Agricola',
            category: 'euro game',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_body: 'Farmyard fun!',
            review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
            created_at: '2021-01-18T10:00:20.514Z',
            votes: 1
          }
        expect(response.body.review).toEqual(expectedReview)
      })  
      });
      test("status:404 if review_id does not currently exist in the database", () => {
        return request(app)
        .get("/api/reviews/400009")
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("selected review not found!");
            });
      });
      test("status: 400 when requested review_id is not an integer", () => {
      return request(app)
        .get("/api/reviews/notAnInteger")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("bad request!");
        });
    });
})

describe("GET /api/reviews", () => {
    test("status:200, responds with an array containing all the review objects which have the correct properties", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            response.body.reviews.forEach((review) => {
                expect(typeof review.owner).toBe('string');
                expect(typeof review.title).toBe('string');
                expect(typeof review.review_id).toBe('number');
                expect(typeof review.category).toBe('string');
                expect(typeof review.review_img_url).toBe('string');
                expect(typeof review.created_at).toBe('string');
                expect(typeof review.votes).toBe('number');
                expect(typeof review.designer).toBe('string');
                expect(typeof review.comment_count).toBe('string');
            })
        expect(response.body.reviews.length).toBe(13)
        })
    })
    test("status:200, response objects are sorted in descending order", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
        expect(response.body.reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
    test("response objects do not contain a review_body property that is present in each object in the reviews data", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            response.body.reviews.forEach((review) => {
                expect(review.hasOwnProperty('review_body')).toBe(false)
            })
        })
    })
    test("status: 400 when requested path is not an valid and responds with an object with a message advising the client they have a miss-type", () => {
        return request(app)
          .get("/api/reviesdw")
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe("Invalid syntax in URL");
          });
      });
})



