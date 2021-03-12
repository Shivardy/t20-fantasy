import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,

  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { score } from '../constants';

const PickPlayers = ({ selectedGameId }) => {
  const [team1, setTeam1] = useState(score.data.team[0]);
  const [team2, setTeam2] = useState(score.data.team[1]);

  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState('');
  const [isElevenSelected, setisElevenSelected] = useState(false)

  useEffect(() => {
    const selectedPlayersTeam1 = team1.players.filter(
      (player) => player.isSelected
    );
    const selectedPlayersTeam2 = team2.players.filter(
      (player) => player.isSelected
    );
    setisElevenSelected(selectedPlayersTeam1.length + selectedPlayersTeam2.length >= 11)
  }, [team1, team2]);

  useEffect(() => {
      setOpen(isElevenSelected);
      setError("You can only select 11 players in total.")
  }, [isElevenSelected])


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={2} justify="center">
        <Grid item md={6}>
          <ListPlayer team={team1} setTeam={setTeam1} isElevenSelected={isElevenSelected}/>
        </Grid>
        <Grid item md={6}>
          <ListPlayer team={team2} setTeam={setTeam2} isElevenSelected ={isElevenSelected}/>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          const temp1 = team1.players.filter((player) => player.isSelected);
          const temp2 = team2.players.filter((player) => player.isSelected);
          console.log(temp1, temp2);
        }}
      >
        Log Selected
      </Button>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning">
          {error}
        </Alert>
      </Snackbar> */}
    </>
  );
};

const ListPlayer = ({ team, setTeam, isElevenSelected }) => {
  const handlePlayerSelected = (index) => {
    team.players[index].isSelected = !team.players[index].isSelected;
    setTeam({...team});
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>
      <Grid container spacing={2} justify="center">
        {team.players.map((player, index) => (
          <Grid item xs={12} key={player.pid}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled = {!player.isSelected && isElevenSelected}
                  checked={!!player.isSelected}
                  onChange={() => handlePlayerSelected(index)}
                  name={player.name}
                  color="primary"
                />
              }
              label={player.name}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PickPlayers;
