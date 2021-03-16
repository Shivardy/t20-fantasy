import {
  Box,
  Checkbox,
  Fab,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';
import React from 'react';

const ListPlayers = ({
  team,
  setTeam,
  isElevenSelected,
  isCaptainSelected,
  isViceCaptainSelected,
}) => {
  const handlePlayerSelected = (index) => {
    team.players[index].isSelected = !team.players[index].isSelected;
    if (team.players[index].isCaptain) team.players[index].isCaptain = false;
    if (team.players[index].isViceCaptain)
      team.players[index].isViceCaptain = false;
    setTeam({ ...team });
  };
  const handleCaptainSelected = (index) => {
    team.players[index].isCaptain = !team.players[index].isCaptain;
    setTeam({ ...team });
  };
  const handleViceCaptainSelected = (index) => {
    team.players[index].isViceCaptain = !team.players[index].isViceCaptain;
    setTeam({ ...team });
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>
      <Grid container spacing={2} justify="center">
        {team.players.map((player, index) => (
          <Grid item xs={12} key={player.pid}>
            <Grid container spacing={2} justify="center">
              <Grid item xs={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!player.isSelected && isElevenSelected}
                      checked={!!player.isSelected}
                      onChange={() => handlePlayerSelected(index)}
                      name={player.name}
                      color="primary"
                    />
                  }
                  label={player.name}
                />
              </Grid>
              <Grid item xs={5}>
                {isElevenSelected && !!player.isSelected && (
                  <>
                    <Box display="flex">
                      <Box mr={1}>
                        <Fab
                          disabled={
                            (!player.isCaptain && isCaptainSelected) ||
                            player.isViceCaptain
                          }
                          size="small"
                          color="primary"
                          onClick={() => handleCaptainSelected(index)}
                        >
                          {(player.isCaptain && isCaptainSelected) ? '2x' : 'C'}
                        </Fab>
                      </Box>
                      <Box ml={1}>
                        <Fab
                          disabled={
                            (!player.isViceCaptain && isViceCaptainSelected) ||
                            player.isCaptain
                          }
                          size="small"
                          color="primary"
                          onClick={() => handleViceCaptainSelected(index)}
                        >
                          {(player.isViceCaptain && isViceCaptainSelected) ? '1.5x' : 'VC'}
                        </Fab>
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ListPlayers;
