import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import MatchView from './MatchView';
import PickPlayers from './PickPlayers';

function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [title, setTitle] = useState('T20 Fantasy');
  const [playing11, setPlaying11] = useState([]);
  console.log(playing11);
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
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box m={1}>
        {!selectedGameId && <MatchView setSelectedGameId={setSelectedGameId} />}
        {selectedGameId && (
          <PickPlayers selectedGameId={selectedGameId} setTitle={setTitle} setPlaying11={setPlaying11}/>
        )}
      </Box>
    </Container>
  );
}

export default App;
