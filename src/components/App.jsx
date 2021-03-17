import { Box, Container } from '@material-ui/core';
import React, { createContext, useEffect, useReducer } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { auth } from '../firebase';
import { initialState, reducer } from '../utils';
import FantasyScore from './FantasyScore';
import MatchView from './MatchView';
import MenuBar from './MenuBar';
import PickPlayers from './PickPlayers';
import { ProtectedRoute } from './ProtectedRoute';

export const Context = createContext();

function App() {
  const queryClient = new QueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = {
    state,
    dispatch,
  };
  console.log(state);
  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user) =>
      dispatch({ type: 'user', user })
    );
    return unSubscribe;
  }, []);

  const { user } = state;
  console.log(user);
  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={contextValue}>
        <Container maxWidth="lg">
          <MenuBar />
          <Box m={1}>
            <BrowserRouter>
              <Switch>
                <Route path="/" exact component={MatchView} />
                <ProtectedRoute path="/match/:id" component={PickPlayers} />
                <ProtectedRoute path="/score" component={FantasyScore} />
                <Route
                  render={() => {
                    window.location.replace('/');
                    return null;
                  }}
                />
              </Switch>
            </BrowserRouter>
          </Box>
        </Container>
      </Context.Provider>
    </QueryClientProvider>
  );
}

export default App;
