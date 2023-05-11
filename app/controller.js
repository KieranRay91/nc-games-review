const { fetchCategories, fetchEndpoints } =  require('./models');


exports.getCategories = (request, response, next) => {
fetchCategories().then((categories) => { 
    response.status(200).send({categories: categories})
}).catch(next)

}

exports.getEndpoints = (request, response, next) => {
    fetchEndpoints().then((result) => {
        response.send(result)
    }).catch(next)
};


