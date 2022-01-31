const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const Post = require('./models/Post');

const typeDefs = gql`
    type Query {
        sayHi: String!
    }
`;

const resolvers = {
    Query: {
        sayHi: () => 'Hello World!'
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen({ port: 8088 }).then((res) => {
    console.log(`Server running at ${res.url}`);
});