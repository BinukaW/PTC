import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"
import { Container } from 'semantic-ui-react';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuNav from './components/Menu';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost'

const httpLink = createHttpLink({
  uri: 'http://localhost:8088'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
            <Route exact path='/home' component={Home}/>
{/* If there is no user logged in, display the AuthRoute components */}
            <AuthRoute exact path="/login" component={Login}/>
            <AuthRoute exact path="/register" component={Register}/>
            <Route exact path='/posts/:postId' component={SinglePost}/>
          </Container>
        </Router>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
