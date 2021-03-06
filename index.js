const { ApolloServer } = require('apollo-server');
const { PubSub } = require('@google-cloud/pubsub');

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Handle request body within context
    context: ({ req }) => ({ req, pubsub })
});

mongoose
    // originally had below as but was not working || .connect(MONGODB, { useNewUrlParser: true })
    .connect(MONGODB, {})

    .then (() => {
            console.log('MongoDB Connected')
        return server.listen({ port: 8088 });
    }) 
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });