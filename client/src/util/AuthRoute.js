import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
// If we have a user then redirect (to avoid logged in users accessing register / login pages)
        user ? <Redirect to="/home" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;