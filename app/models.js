const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const fs = require("fs/promises");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "selected review does not exist!",
        });
      } else {
        return result.rows;
      }
    });
};

exports.fetchAllComments = () => {
  return db.query(`SELECT * FROM comments;`).then((result) => {
    return result.rows;
  });
};

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
    ORDER BY reviews.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC;`,
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateCommentsByReviewId = (postedComment, review_id) => {
  const { username, body } = postedComment;
  if (username && body) {
    if (typeof username === "string" && typeof body === "string") {
      return this.fetchReviewById(review_id).then(() => {
        return db
          .query(
            `INSERT INTO comments
    (body, author,review_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
            [body, username, review_id]
          )
          .then((comment) => {
            return comment.rows[0];
          });
      });
    } else {
      return Promise.reject({
        status: 400,
        msg: "posted object properties must be a string",
      });
    }
  } else {
    return Promise.reject({
      status: 400,
      msg: "missing a property on posted object",
    });
  }
};

exports.updateReviewVotes = (votesAdjustment, review_id) => {
  if(typeof votesAdjustment === 'number') {
    return this.fetchReviewById(review_id).then(() => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1
 WHERE review_id = $2
 RETURNING *;`,
      [votesAdjustment, review_id]
    )
    .then((review) => {
      return review.rows[0];
    });
  });
  } else {
    return Promise.reject({status:400, msg: 'request must include a inc_votes numerical value'})
  }
};
