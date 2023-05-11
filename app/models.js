const db = require("../db/connection");


exports.fetchCategories = () => {
    return db
      .query(`SELECT * FROM categories`)
      .then((result) => {
       return result.rows;
      });
  };


  exports.fetchReviewById = (review_id) => {
    const idStringToNumber = parseInt(review_id)
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1`, [idStringToNumber])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "selected review not found!" });
        } else {
          return result.rows;
        }
      });
  };
