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
import React, { useEffect } from 'react';
import { matches } from '../constants';


const MatchView = ({setSelectedGameId}) => {
  const isIndia = (str) => str.toLowerCase().includes('india');
  const isT20 = (str) => str.toLowerCase().includes('twenty20');
  

  const fetchMatches = async () => {
    const response = await fetch(`https://cricapi.com/api/matches?apikey=${process.env.REACT_APP_API_KEY}`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    // const matches = await firestore.collection('matches').get();
    // matches.forEach(doc => {
    //   const data = doc.data();
    //   console.log(data, doc);
    // })
    // console.log(matches);
    // console.log(process.env);
    // fetchMatches();
  }, [])

  const indiaMatches = matches.matches
    .filter((match) => isT20(match.type))
    .filter((match) => isIndia(match['team-1']) || isIndia(match['team-1']));

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
                  <Button variant="contained" color="primary" onClick={() => setSelectedGameId(match.unique_id)}>
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
