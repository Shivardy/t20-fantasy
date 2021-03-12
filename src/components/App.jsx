import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import MatchView from './MatchView';
import PickPlayers from './PickPlayers';

function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);
  return (
    <Container maxWidth="md">
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h4"
            id="tableTitle"
            component="div"
            align="center"
            gutterBottom
          >
            T20 Fantasy
          </Typography>
        </Toolbar>
      </AppBar>

      <MatchView setSelectedGameId = {setSelectedGameId}/>
      {selectedGameId && <PickPlayers selectedGameId = {selectedGameId}/>}
    </Container>
  );
}

export default App;
