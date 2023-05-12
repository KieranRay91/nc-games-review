const express = require("express");
const {getCategories, getEndpoints, getReviewById, getAllUpdatedReviews } =  require('./controller')
const app = express();
const fs = require("fs/promises");

app.get('/api/categories', getCategories)

app.get('/api', getEndpoints)

app.get('/api/reviews/:review_id', getReviewById)

app.get('/api/reviews', getAllUpdatedReviews)

app.use((request, response) => {
    response.status(404).send({ message: 'Invalid syntax in URL' });
  });

app.use((err, requst, response, next) => {
    const invalidRequest = ["42703", "22P02", "42601", "23502"];
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

