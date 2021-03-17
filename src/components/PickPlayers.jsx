import { Box, Button, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchFantasySummaryData } from '../api';
import { Context } from './App';
import ListPlayers from './ListPlayers';

const PickPlayers = () => {
  const { dispatch } = useContext(Context);

  const { id } = useParams();

  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [isElevenSelected, setisElevenSelected] = useState(false);
  const [isCaptainSelected, setIsCaptainSelected] = useState(false);
  const [isViceCaptainSelected, setIsViceCaptainSelected] = useState(false);
  const { status, data } = useQuery(`${id}`, fetchFantasySummaryData);

  useEffect(() => {
    if (status === 'success') {
      setTeam1(data.data.team[0]);
      setTeam2(data.data.team[1]);
    }
  }, [setTeam1, setTeam2, status, data]);

  useEffect(() => {
    dispatch({ type: 'title', title: 'T20 Fantasy - Pick Your Playing 11' });
    return () => dispatch({ type: 'title', title: 'T20 Fantasy' });
  }, [dispatch]);

  useEffect(() => {
    if (!(team1 || team2)) return;
    const players = [...team1.players, ...team2.players];
    const selectedPlayers = players.filter((p) => p.isSelected);
    setisElevenSelected(selectedPlayers.length >= 11);
    setIsCaptainSelected(!!players.find((p) => p.isCaptain));
    setIsViceCaptainSelected(!!players.find((p) => p.isViceCaptain));
  }, [team1, team2]);

  const getPlaying11 = () =>
    [...team1.players, ...team2.players].filter((p) => p.isSelected);

  if (status === 'loading' || !(team1 || team2)) return <div>Loading..</div>;
  if (status === 'error') return <div>Error..</div>;

  if (!team1.players.length || !team2.players.length)
    return <div>Players data not avaialble. Try again alter.</div>;
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
        <Link
          to={{
            pathname: '/score',
            state: {
              score: data,
              playing11: getPlaying11(),
            },
          }}
        >
          <Button
            disabled={
              !(isElevenSelected && isCaptainSelected && isViceCaptainSelected)
            }
            variant="contained"
            color="primary"
          >
            Calculate Fantasy Points
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default PickPlayers;
