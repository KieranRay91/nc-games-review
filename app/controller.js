const { fetchCategories } =  require('./models');


exports.getCategories = (request, response, next) => {
fetchCategories().then((categories) => { 
    response.status(200).send({categories: categories})
}).catch(next)

}