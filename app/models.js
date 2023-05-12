const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");


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

  exports.fetchAllComments = () => {
    return db
    .query(`SELECT * FROM comments;`).then((result) => {
      return result.rows;
    })
  }

  exports.fetchAllReviews = () => {
    return db
    .query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
    ORDER BY reviews.created_at DESC;`).then((result) => {
     return result.rows;
  });
  };

