import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { score } from '../constants';
import ListPlayers from './ListPlayers';

const PickPlayers = ({ selectedGameId, setTitle, setPlaying11, setScore }) => {
  const [team1, setTeam1] = useState(score.data.team[0]);
  const [team2, setTeam2] = useState(score.data.team[1]);

  const [isElevenSelected, setisElevenSelected] = useState(false);
  const [isCaptainSelected, setIsCaptainSelected] = useState(false);
  const [isViceCaptainSelected, setIsViceCaptainSelected] = useState(false);

  useEffect(() => {
    setScore(score);
  }, [setScore])

  useEffect(() => {
    setTitle('T20 Fantasy - Pick Your Playing 11');
    return () => setTitle('T20 Fantasy');
  }, [setTitle]);

  useEffect(() => {
    const players = [...team1.players, ...team2.players];
    const selectedPlayers = players.filter((p) => p.isSelected);
    setisElevenSelected(selectedPlayers.length >= 11);
    setIsCaptainSelected(!!players.find((p) => p.isCaptain));
    setIsViceCaptainSelected(!!players.find((p) => p.isViceCaptain));
  }, [team1, team2]);

  const handleCalculateFantasyPoints = () => {
    const players = [...team1.players, ...team2.players];
    setPlaying11(players.filter((p) => p.isSelected));
  };

  return (
    <>
      <Grid container spacing={2} justify="center">
        <Grid item md={6}>
          <ListPlayers
            team={team1}
            setTeam={setTeam1}
            isElevenSelected={isElevenSelected}
            isCaptainSelected={isCaptainSelected}
            isViceCaptainSelected={isViceCaptainSelected}
          />
        </Grid>
        <Grid item md={6}>
          <ListPlayers
            team={team2}
            setTeam={setTeam2}
            isElevenSelected={isElevenSelected}
            isCaptainSelected={isCaptainSelected}
            isViceCaptainSelected={isViceCaptainSelected}
          />
        </Grid>
      </Grid>
      <Box mt={2} mb={2}>
        <Button
          disabled={
            !(isElevenSelected && isCaptainSelected && isViceCaptainSelected)
          }
          variant="contained"
          color="primary"
          onClick={handleCalculateFantasyPoints}
        >
          Calculate Fantasy Points
        </Button>
      </Box>
    </>
  );
};

export default PickPlayers;
