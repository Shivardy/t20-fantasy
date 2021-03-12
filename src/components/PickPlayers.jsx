import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { score } from '../constants';

const PickPlayers = ({ selectedGameId }) => {
  const [team1, setTeam1] = useState(score.data.team[0]);
  const [team2, setTeam2] = useState(score.data.team[1]);

  return (
    <>
      <Grid container spacing={2} justify="center">
        <Grid item md={6}>
          <ListPlayer team={team1} setTeam={setTeam1} />
        </Grid>
        <Grid item md={6}>
          <ListPlayer team={team2} setTeam={setTeam2} />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={() => {
        const temp1 = team1.players.filter(player => player.isSelected);
        const temp2 = team2.players.filter(player => player.isSelected);
        console.log(temp1, temp2);
      }}>
        Log Selected
      </Button>
    </>
  );
};

const ListPlayer = ({ team, setTeam }) => {
  const handlePlayerSelected = (index) => {
    team.players[index].isSelected = true;
    setTeam(team);
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
                  checked={player.isSelected}
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
