import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { fetchMatchData } from '../api';
// import { matches } from '../constants';

const MatchView = ({ setMatchId }) => {
  const {status, data} = useQuery('fetchMatchData', fetchMatchData);

  if(status === 'loading') return <div>Loading..</div>
  if(status === 'error') return <div>Error..</div>

  const indiaMatches = data.matches;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {indiaMatches.map((match) => (
            <TableRow key={match.unique_id}>
              <TableCell component="th" scope="row">
                <Typography variant="h6" gutterBottom>
                  {match['team-1']} vs {match['team-2']}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {new Date(match.dateTimeGMT).toDateString()}{' '}
                  {new Date(match.dateTimeGMT).toLocaleTimeString()}
                </Typography>
              </TableCell>

              <TableCell align="right">
                {match.matchStarted && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setMatchId(match.unique_id)}
                  >
                    Play Fantasy
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchView;
