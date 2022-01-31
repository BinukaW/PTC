const postsResolvers = require('./posts');
const usersResolvers = require('./users');

// Combines posts and users
module.exports = {
    Query: {
        ...postsResolvers.Query
    }
}