import { firestore } from './firebase';

const fetchMatches = async () => {
  const response = await fetch(
    `https://cricapi.com/api/matches?apikey=${process.env.REACT_APP_API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const fetchMatchData = async () => {
  const matchesSnapshot = await firestore.collection('matches').get();
  let [data] = matchesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (!data) {
    // if no data pull it from api
    data = await fetchMatches();
    await firestore.collection('matches').add(data);
  }
  const {
    provider: { pubDate },
    id,
  } = data;
  console.log(`Remaining ${120 - (new Date() - new Date(pubDate)) / 60000} minutes to update matches data`);
  if ((new Date() - new Date(pubDate)) / 60000 > 120) {
    // get fresh data for every 120 minutes
    await firestore.collection('matches').doc(id).delete();
    data = await fetchMatches();
    console.log('adding fresh data');
    await firestore.collection('matches').add(data);
  }
  return data;
};

const fetchFantasySummary = async (matchId) => {
  const response = await fetch(
    `https://cricapi.com/api/fantasySummary?apikey=${process.env.REACT_APP_API_KEY}&unique_id=${matchId}`
  );
  const data = await response.json();
  return { matchId, ...data };
};

export const fetchFantasySummaryData = async (matchId) => {
  const matchesSnapshot = await firestore.collection('fantasySummary').get();
  let [data] = matchesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).find((data) => data.matchId === matchId);

  if (!data) {
    // if no data pull it from api
    data = await fetchFantasySummary(matchId);
    await firestore.collection('fantasySummary').add(data);
  }
  const {
    provider: { pubDate },
    id,
  } = data;
  console.log(`Remaining ${10 - (new Date() - new Date(pubDate)) / 60000} minutes to update Fantasy data`);
  if ((new Date() - new Date(pubDate)) / 60000 > 10) {
    // get fresh data for every 10 minutes
    await firestore.collection('fantasySummary').doc(id).delete();
    data = await fetchFantasySummary();
    console.log('adding fresh data');
    await firestore.collection('fantasySummary').add(data);
  }
  return data;
};
