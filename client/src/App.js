import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"
import { Container } from 'semantic-ui-react';

// import MenuNav from './components/Menu';
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';


// const client = new ApolloClient({
//   uri: '/graphql',
//   cache: new InMemoryCache()
// });


function App() {
  return (
    // <ApolloProvider client={client}>
    <Router>
      {/* <Container> */}
        {/* <MenuNav /> */}
        <Route exact path='/' component={Home}/>
        {/* <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/> */}
        <p>Hey i hope this works</p>
      {/* </Container> */}
    </Router>
    // </ApolloProvider>
  );
}

export default App;
