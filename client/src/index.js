import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';

import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<App />, document.getElementById('root'));

// Change unregister() to register() to make the app work offline and improve load-time.
serviceWorker.unregister();