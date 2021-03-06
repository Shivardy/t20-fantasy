import { odiGrading, t20grading } from './constants';

export const calculateScores = (score, playing11) => {
  const {
    data: { fielding, bowling, batting },
    type,
  } = score || { data: { fielding: [], bowling: [], batting: [] } };

  const getScores = (data) =>
    data
      .map(({ scores }) => scores)
      .reduce((score, acc) => [...acc, ...score], []);

  const battingScores = getScores(batting);
  const bowlingScores = getScores(bowling);
  const fieldingScores = getScores(fielding);

  const attachScores = (player, scores) => {
    const fielding = fieldingScores.find(({ pid }) => pid === player.pid);
    const bowling = bowlingScores.find(({ pid }) => pid === player.pid);
    const batting = battingScores.find(({ pid }) => pid === player.pid);
    return {
      ...player,
      fielding,
      bowling,
      batting,
      type,
    };
  };

  return playing11
    .map(attachScores)
    .map(calculateBattingScore)
    .map(calculateBowlingScore)
    .map(calculateFieldingScore)
    .map(calculateEconomyScore)
    .map(calculateStrikeRateScore)
    .map(calculateCaptainsScore);
};

const getGrading = (type) => (type === 'ODI' ? odiGrading : t20grading);

const calculateBattingScore = (player) => {
  const { batting, type } = player;
  const {
    batting: { run, four, six, duckOut, halfCentury, century },
  } = getGrading(type);
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
  const { bowling, type } = player;
  const {
    bowling: { wicket, fourWicket, fiveWicket, maiden },
  } = getGrading(type);
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
  const { fielding, type } = player;
  const {
    fielding: { runOut, stumping, catches },
  } = getGrading(type);
  if (fielding) {
    const noCatches = fielding['catch'];
    const noRunOuts = fielding['runout'];
    const noStumpings = fielding['stumped'];
    player.noCatches = noCatches;
    player.noRunOuts = noRunOuts;
    player.noStumpings = noStumpings;
    let score = player.score || 0;
    score += noCatches * catches + noRunOuts * runOut + noStumpings * stumping;
    player.score = score;
  }
  return player;
};

const calculateT20EconomyScore = (player) => {
  const { bowling } = player;
  const {
    economy: {
      above11,
      below4,
      between10To11,
      between4To5,
      between5to6,
      between9To10,
    },
  } = t20grading;
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

const calculateODIEconomyScore = (player) => {
  const { bowling } = player;
  const {
    economy: {
      above9,
      below2_5,
      between8To9,
      between2_5to3_5,
      between3_5to4_5,
      between7To8,
    },
  } = odiGrading;
  if (bowling) {
    const overs = bowling['O'];
    if (overs >= 4) {
      //only applies if bowled atleast 4 overs
      const economy = bowling['Econ'];
      player.economy = economy;
      let score = player.score || 0;
      if (economy <= 2.5) score += below2_5;
      else if (economy <= 3.5) score += between2_5to3_5;
      else if (economy <= 4.5) score += between3_5to4_5;
      else if (economy <= 8) score += between7To8;
      else if (economy <= 9) score += between8To9;
      else score += above9;
      player.score = score;
    }
  }
  return player;
};

const calculateEconomyScore = (player) =>
  player.type === 'ODI'
    ? calculateODIEconomyScore(player)
    : calculateT20EconomyScore(player);

const calculateStrikeRateScore = (player) => {
  const { batting, type } = player;
  const {
    strikeRate: {
      above140,
      below50,
      between100To120,
      between120To140,
      between50To60,
      between60To70,
    },
  } = getGrading(type);

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

export const initialState = {
  title: 'Fantasy Cricket',
  user: null,
  isCreateRoomOpen: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'title':
      return { ...state, title: action.title };
    case 'user':
      return { ...state, user: action.user };
    case 'toggleCreateRoom':
      return { ...state, isCreateRoomOpen: !state.isCreateRoomOpen };
    default:
      return state;
  }
};
