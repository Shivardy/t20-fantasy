import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchFantasySummaryData } from '../api';
import ListPlayers from './ListPlayers';

const PickPlayers = ({ matchId, setTitle, setPlaying11, setScore }) => {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [isElevenSelected, setisElevenSelected] = useState(false);
  const [isCaptainSelected, setIsCaptainSelected] = useState(false);
  const [isViceCaptainSelected, setIsViceCaptainSelected] = useState(false);
  const {status, data} = useQuery(`${matchId}`, fetchFantasySummaryData);


  useEffect(() => {
    if(status ==='success'){
      setScore(data);
      setTeam1(data.data.team[0]);
      setTeam2(data.data.team[1]);
    }
  }, [setScore, setTeam1, setTeam2, status, data])
  

  useEffect(() => {
    setTitle('T20 Fantasy - Pick Your Playing 11');
    return () => setTitle('T20 Fantasy');
  }, [setTitle]);

  useEffect(() => {
    if(!(team1 || team2)) return;
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

  if(status === 'loading' || !(team1 || team2)) return <div>Loading..</div>
  if(status === 'error') return <div>Error..</div>

  if(!team1.players.length || !team2.players.length) return <div>Players data not avaialble. Try again alter.</div>
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
