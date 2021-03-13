import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import FantasyScore from './FantasyScore';
import MatchView from './MatchView';
import PickPlayers from './PickPlayers';

function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [title, setTitle] = useState('T20 Fantasy');
  const [playing11, setPlaying11] = useState([]);
  const [score, setScore] = useState(null);

  return (
    <Container maxWidth="lg">
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
        {selectedGameId && !playing11.length && (
          <PickPlayers
            selectedGameId={selectedGameId}
            setTitle={setTitle}
            setPlaying11={setPlaying11}
            setScore={setScore}
          />
        )}
        {selectedGameId && !!playing11.length && (
          <FantasyScore
            score={score}
            playing11={playing11}
            setTitle={setTitle}
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
