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
import { grading } from '../constants';
const FantasyScore = ({ score, playing11, setTitle }) => {
  const {
    data: {
      fielding: [{ scores: fieldingTeam1 }, { scores: fieldingTeam2 }],
      bowling: [{ scores: bowlingTeam1 }, { scores: bowlingTeam2 }],
      batting: [{ scores: battingTeam1 }, { scores: battingTeam2 }],
    },
  } = score;

  const fieldingScores = [...fieldingTeam1, ...fieldingTeam2];
  const bowlingScores = [...bowlingTeam1, ...bowlingTeam2];
  const battingScores = [...battingTeam1, ...battingTeam2];

  const attachScores = (player) => {
    const fielding = fieldingScores.find(({ pid }) => pid === player.pid);
    const bowling = bowlingScores.find(({ pid }) => pid === player.pid);
    const batting = battingScores.find(({ pid }) => pid === player.pid);
    return {
      ...player,
      fielding,
      bowling,
      batting,
    };
  };

  const calculateBattingScore = (player) => {
    const {
      batting: { run, four, six, duckOut, halfCentury, century },
    } = grading;
    const { batting } = player;
    if (batting) {
      const runs = batting['R'];
      const fours = batting['4s'];
      const sixes = batting['6s'];
      player.runs = runs;
      player.fours = fours;
      player.sixes = sixes;
      let score = player.score || 0;
      score += runs * run + fours * four + sixes * six;
      if (runs === 0) score += duckOut;
      else if (runs >= 50) score += halfCentury;
      else if (runs >= 100) score += century;
      player.score = score;
    }
    return player;
  };

  const calculateBowlingScore = (player) => {
    const {
      bowling: { wicket, fourWicket, fiveWicket, maiden },
    } = grading;
    const { bowling } = player;
    if (bowling) {
      const noWickets = bowling['W'];
      const noMaidens = bowling['M'];
      player.noWickets = noWickets;
      player.noMaidens = noMaidens;
      let score = player.score || 0;
      score += noWickets * wicket + noMaidens * maiden;
      if (noWickets === 4) score += fourWicket;
      else if (noWickets >= 5) score += fiveWicket;
      player.score = score;
    }
    return player;
  };

  const calculateFieldingScore = (player) => {
    const {
      fielding: { runOut, stumping, catches },
    } = grading;
    const { fielding } = player;
    if (fielding) {
      const noCatches = fielding['catch'];
      const noRunOuts = fielding['runout'];
      const noStumpings = fielding['stumped'];
      player.noCatches = noCatches;
      player.noRunOuts = noRunOuts;
      player.noStumpings = noStumpings;
      let score = player.score || 0;
      score +=
        noCatches * catches + noRunOuts * runOut + noStumpings * stumping;
      player.score = score;
    }
    return player;
  };

  const calculateEconomyScore = (player) => {
    const {
      economy: {
        above11,
        below4,
        between10To11,
        between4To5,
        between5to6,
        between9To10,
      },
    } = grading;
    const { bowling } = player;
    if (bowling) {
      const overs = bowling['O'];
      if (overs >= 2) {
        //only applies if bowled atleast 2 overs
        const economy = bowling['Econ'];
        player.economy = economy;
        let score = player.score || 0;
        if (economy <= 4) score += below4;
        else if (economy <= 5) score += between4To5;
        else if (economy <= 6) score += between5to6;
        else if (economy <= 10) score += between9To10;
        else if (economy <= 11) score += between10To11;
        else score += above11;
        player.score = score;
      }
    }
    return player;
  };

  const calculateStrikeRateScore = (player) => {
    const {
      strikeRate: {
        above140,
        below50,
        between100To120,
        between120To140,
        between50To60,
        between60To70,
      },
    } = grading;
    const { batting } = player;
    if (batting) {
      const ballsFaced = batting['B'];
      if (ballsFaced >= 10) {
        let strikeRate = batting['SR'];
        player.strikeRate = strikeRate;
        let score = player.score || 0;
        if (strikeRate <= 50) score += below50;
        else if (strikeRate <= 60) score += between50To60;
        else if (strikeRate <= 70) score += between60To70;
        else if (strikeRate <= 120) score += between100To120;
        else if (strikeRate <= 140) score += between120To140;
        else score += above140;
        player.score = score;
      }
    }
    return player;
  };

  const calculateCaptainsScore = (player) => {
    if (player.isCaptain) player.score *= 2;
    if (player.isViceCaptain) player.score *= 1.5;
    return player;
  };

  playing11 = playing11
    .map(attachScores)
    .map(calculateBattingScore)
    .map(calculateBowlingScore)
    .map(calculateFieldingScore)
    .map(calculateEconomyScore)
    .map(calculateStrikeRateScore)
    .map(calculateCaptainsScore);

  console.log(playing11);
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
            {playing11.map((player) => (
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
                  {playing11.map(({score}) => score || 0).reduce((score, acc)=> score+ acc)}
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
