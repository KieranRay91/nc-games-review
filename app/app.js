const express = require("express");
const {getCategories, getEndpoints} =  require('./controller')
const app = express();
const fs = require("fs/promises");

app.get('/api/categories', getCategories)

app.get('/api', getEndpoints)

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
  });


module.exports = app;