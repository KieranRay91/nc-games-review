const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, 
    COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    LIMIT 1;`,
      [review_id]
    )
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

exports.fetchAllReviews = (
  category,
  sort_by = "created_at",
  order = "desc"
) => {
  let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`;

  const query = [];

  const validSortCategories = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];

  if (category) {
    queryStr += ` WHERE reviews.category = $1`;
    query.push(category);
  }

  if (!validSortCategories.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query!" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  queryStr += ` GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer 
  ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryStr, query).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({ status: 400, msg: "Invalid category query" });
    } else {
      return result.rows;
    }
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

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
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
    (body, author, review_id)
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
  if (typeof votesAdjustment === "number") {
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
    return Promise.reject({
      status: 400,
      msg: "request must include a inc_votes numerical value",
    });
  }
};

exports.removeComment = (comment_id) => {
  return db
    .query(`SELECT * from comments WHERE comment_id = $1;`, [comment_id])
    .then((comment) => {
      if (comment.rows.length === 1) {
        return db
          .query(`DELETE from comments WHERE comment_id = $1;`, [comment_id])
          .then((comment) => {
            return;
          });
      } else {
        return Promise.reject({
          status: 400,
          msg: "request must include a inc_votes numerical value",
        });
      }
    });
};
