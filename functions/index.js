const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onCall(async (request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });

  const res = await fetch(
    `https://cricapi.com/api/matches?apikey=krR0G9FLOYgYp0mVnCzbWOyMpDz1`
  );
  const data = await res.json();
  response.json({ data });
});
