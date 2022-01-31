const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const Post = require('./models/Post');

const { MONGODB } = require('./config.js');

const typeDefs = gql`
    type Query {
        sayHi: String!
    }
`;

const resolvers = {
    Query: {
        sayHi: () => 'Hello World!!!!'
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose
    // originally had below as but was not working || .connect(MONGODB, { useNewUrlParser: true })
    .connect(MONGODB, { })

    .then (() => {
            console.log('MongoDB Connected')
        return server.listen({ port: 8088 });
    }) 
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });