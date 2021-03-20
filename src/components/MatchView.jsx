import {
  Button,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Typography
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { fetchMatchData } from '../api';
import { Context } from './App';

const MatchView = () => {
  const {
    state: { user },
  } = useContext(Context);

  const { status, data } = useQuery('fetchMatchData', fetchMatchData);
  const [matchType, setMatchType] = useState(0);
  const matchTypes = ['Twenty20', 'ODI', ''];

  const handleChange = (event, newValue) => setMatchType(newValue);
  

  if (status === 'loading') return <div>Loading..</div>;
  if (status === 'error') return <div>Error..</div>;
  const matches = data.matches
    .filter(({ squad }) => squad)
    .filter(({ type }) => !['Tests', 'First-class'].includes(type))
    .filter(({ type }) => type === matchTypes[matchType]);

  return (
    <>
      <Paper>
        <Tabs
          value={matchType}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Twenty20" />
          <Tab label="ODI" />
          <Tab label="Others" />
        </Tabs>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {matches.map((match) => (
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
                  {user && match.matchStarted && (
                    <Link to={`/match/${match.unique_id}`}>
                      <Button variant="contained" color="primary">
                        Calculate Points
                      </Button>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MatchView;
