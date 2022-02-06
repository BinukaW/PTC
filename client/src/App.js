import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"
import { Container } from 'semantic-ui-react';
import { createHttpLink } from 'apollo-link-http';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuNav from './components/Menu';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const httpLink = createHttpLink({
  uri: 'http://localhost:8088'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    // AuthProvider provides access to user context
    <AuthProvider>
      <ApolloProvider client={client}>
        <Router>
          <Container>
            <MenuNav />
            <Route exact path='/' component={Home}/>
            <AuthRoute exact path="/login" component={Login}/>
            <AuthRoute exact path="/register" component={Register}/>
            <p>Hey i hope this works</p>
          </Container>
        </Router>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
