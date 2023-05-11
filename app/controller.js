const { fetchCategories, fetchReviewById } =  require('./models');
const fs = require("fs/promises");

exports.getCategories = (request, response, next) => {
fetchCategories().then((categories) => { 
    response.status(200).send({categories: categories})
}).catch(next)
};

exports.getEndpoints = (request, response, next) => {
    return fs.readFile('endpoints.json', 'utf-8').then((data) => {
        return JSON.parse(data)
        }).then((result) => {
        response.send(result)
    }).catch(next)
};


exports.getReviewById = (request, response, next) => {
    const review_id = request.params.review_id;
    fetchReviewById(review_id).then((review) => {
        const requestedReview = review[0]
        response.status(200).send(({ review: requestedReview }))
    }).catch(next)
};
