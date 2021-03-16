import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import { Router } from '@reach/router';
import React, { createContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import FantasyScore from './FantasyScore';
import MatchView from './MatchView';
import PickPlayers from './PickPlayers';
export const Context = createContext();

function App() {
  const [title, setTitle] = useState('T20 Fantasy');
  const queryClient = new QueryClient();

  const contextValue = {
    title,
    setTitle,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth="lg">
        <Context.Provider value={contextValue}>
          <AppBar position="sticky">
            <Toolbar>
              <Typography
                variant="h4"
                id="tableTitle"
                component="div"
                align="center"
                gutterBottom
              >
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box m={1}>
            <Router>
              {<MatchView default path="/" />}
              {<PickPlayers path="/match/:id" />}
              {<FantasyScore path="/match/:id/score" />}
            </Router>
          </Box>
        </Context.Provider>
      </Container>
    </QueryClientProvider>
  );
}

export default App;
