const db = require("../db/connection");
const { request } = require("./app");

exports.fetchCategories = () => {
    return db
      .query(`SELECT * FROM categories`)
      .then((result) => {
       return result.rows;
      });
  };
  