const {
  fetchCategories,
  fetchReviewById,
  fetchAllReviews,
  fetchCommentsByReviewId,
  updateCommentsByReviewId,
  updateReviewVotes,
  removeComment,
  fetchAllUsers,
} = require("./models");
const fs = require("fs/promises");

exports.getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch(next);
};

exports.getEndpoints = (request, response, next) => {
  return fs
    .readFile("endpoints.json", "utf-8")
    .then((data) => {
      return JSON.parse(data);
    })
    .then((result) => {
      response.send(result);
    })
    .catch(next);
};

exports.getReviewById = (request, response, next) => {
  const review_id = request.params.review_id;
  fetchReviewById(review_id)
    .then((review) => {
      const requestedReview = review[0];
      response.status(200).send({ review: requestedReview });
    })
    .catch(next);
};

exports.getAllUpdatedReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;
  fetchAllReviews(category, sort_by, order)
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (request, response, next) => {
  const reviewId = request.params.review_id;
  fetchReviewById(reviewId)
    .then(() => {
      fetchCommentsByReviewId(reviewId).then((comments) => {
        response.status(200).send({ comments: comments });
      });
    })
    .catch(next);
};

exports.getAllUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send({ users: users });
    })
    .catch(next);
};

exports.postCommentByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  const postedComment = request.body;
  updateCommentsByReviewId(postedComment, review_id)
    .then((comment) => {
      response.status(201).send({ addedComment: comment });
    })
    .catch(next);
};

exports.updateReviewById = (request, response, next) => {
  const { review_id } = request.params;
  const votesAdjustment = request.body.inc_votes;
  updateReviewVotes(votesAdjustment, review_id)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch(next);
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((comment) => {
      response.status(204).send({});
    })
    .catch(next);
};
