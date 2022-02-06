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

const httpLink = createHttpLink({
  uri: 'http://localhost:8088'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
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
{/* If there is no user logged in, display the AuthRoute components */}
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
