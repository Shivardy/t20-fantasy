import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import { calculateScores } from '../utils';

const FantasyScore = ({ score, playing11, setTitle }) => {
  const players = calculateScores(score, playing11);

  console.log(players);
  useEffect(() => {
    setTitle('T20 Fantasy - Your Team');
    return () => setTitle('T20 Fantasy');
  }, [setTitle]);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="h5" gutterBottom>
                  Player
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" gutterBottom>
                  Score
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <Row player={player} key={player.pid} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="h5" gutterBottom>
                  Total Points
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5" gutterBottom>
                  {players
                    .map(({ score }) => score || 0)
                    .reduce((score, acc) => score + acc)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

const Row = ({ player }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow key={player.pid}>
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="h6" gutterBottom>
            {player.name} {player.isCaptain && '(C)'}{' '}
            {player.isViceCaptain && '(Vc)'}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="h6" gutterBottom>
            {player.score || 0}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Runs</TableCell>
                    <TableCell>Fours</TableCell>
                    <TableCell>Sixes</TableCell>
                    <TableCell>StrikeRate</TableCell>
                    <TableCell>Wickets</TableCell>
                    <TableCell>Maidens</TableCell>
                    <TableCell>Economy</TableCell>
                    <TableCell>Catches</TableCell>
                    <TableCell align="right">Stumpings</TableCell>
                    <TableCell align="right">Runouts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{player.runs || 0}</TableCell>
                    <TableCell>{player.fours || 0}</TableCell>
                    <TableCell>{player.sixes || 0}</TableCell>
                    <TableCell>{player.strikeRate || 0}</TableCell>
                    <TableCell>{player.noWickets || 0}</TableCell>
                    <TableCell>{player.noMaidens || 0}</TableCell>
                    <TableCell>{player.economy || 0}</TableCell>
                    <TableCell>{player.noCatches || 0}</TableCell>
                    <TableCell align="right">
                      {player.noStumpings || 0}
                    </TableCell>
                    <TableCell align="right">{player.noRunOuts || 0}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default FantasyScore;
