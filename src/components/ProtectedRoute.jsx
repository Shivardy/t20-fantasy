import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Context } from './App';

export const ProtectedRoute = (props) => {
  const {
    state: { user },
  } = useContext(Context);

  if (!user) return <Redirect to="/" />;

  return <Route {...props} />;
};
