
import React from 'react';
import { Route, Navigate } from 'react-router-dom';


const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn ? (
        <Component {...props} userEmail="raj3322" />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
