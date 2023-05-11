const express = require("express");
const {getCategories, getEndpoints, getReviewById} =  require('./controller')
const app = express();
const fs = require("fs/promises");

app.get('/api/categories', getCategories)

app.get('/api', getEndpoints)

app.get('/api/reviews/:review_id', getReviewById)

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
      response.status(err.status).send({ message: err.msg });
    } else {
      next(err);
    }
  });

app.use((err, requst, response, next) => {
    const invalidRequest = '22P02';
    if (err.code === invalidRequest) {
      response.status(400).send({ message: "bad request!" });
    }
  });

app.use((err, request, response, next) => {
    response.status(500).send({ message: 'Internal Server Error' });
  });


module.exports = app;