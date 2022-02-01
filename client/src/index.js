import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import ApolloProvider from './ApolloProvider'

ReactDOM.render(ApolloProvider, document.getElementById('root'));

// Change unregister() to register() to make the app work offline and improve load-time.
serviceWorker.unregister();