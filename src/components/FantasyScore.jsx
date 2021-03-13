import { Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
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
      const wicketsTaken = bowling['W'];
      const maidensBowled = bowling['M'];
      let score = player.score || 0;
      score += wicketsTaken * wicket + maidensBowled * maiden;
      if (wicketsTaken === 4) score += fourWicket;
      else if (wicketsTaken >= 5) score += fiveWicket;
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
  }, []);

  return (
    <>
      {playing11.map((player) => (
        <Grid container spacing={2} key={player.pid}>
          <Grid item md={8}>
            <Typography variant="h5" gutterBottom>
              {player.name} {player.isCaptain && '(C)'}{' '}
              {player.isViceCaptain && '(Vc)'}
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Typography variant="h5" gutterBottom>
              Score {player.score}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default FantasyScore;
