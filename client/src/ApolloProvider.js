import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

// This code is now located in App.js
const httpLink = createHttpLink({
  uri: 'http://localhost:8088'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      authorization: token
    }
  };
});

// This code is now located in App.js
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


export default function Provider() {
  return  (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)}