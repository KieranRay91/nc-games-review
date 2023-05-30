const cors = require('cors');
const express = require("express");
const {getCategories, getEndpoints, getReviewById, getAllUpdatedReviews, getCommentsByReviewId, postCommentByReviewId, updateReviewById } =  require('./controller')
const app = express();
const fs = require("fs/promises");


app.use(cors());

app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api', getEndpoints)

app.get('/api/reviews/:review_id', getReviewById)

app.get('/api/reviews', getAllUpdatedReviews)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

app.post('/api/reviews/:review_id/comments', postCommentByReviewId)

app.patch('/api/reviews/:review_id', updateReviewById)

app.use((request, response) => {
    response.status(404).send({ message: 'Invalid syntax in URL' });
  });

app.use((err, requst, response, next) => {
  const invalidInput = "22P02"
    const invalidRequest = ["42703", "42601", "23502"];
    if(err.code === invalidInput) {
      response.status(404).send({ message: "requested id is not a valid integer"})
    }
    if (invalidRequest.includes(err.code)) {
      response.status(400).send({ message: "bad request!" });
    } else {
      next(err)
    }
  });

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
      return response.status(err.status).send({ message: err.msg });
    } else {
      next(err);
    }
  });


app.use((err, request, response, next) => {
    response.status(500).send({ message: 'Internal Server Error' });
  });

module.exports = app;

