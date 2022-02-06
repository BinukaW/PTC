import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

// This code is now located in App.js
const httpLink = createHttpLink({
  uri: 'http://localhost:8088'
});
// This code is now located in App.js
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default function Provider() {
  return  (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)}