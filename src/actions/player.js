import firebase from '../firebase';

export async function addPlayer(name) {
  const db = firebase.firestore();
  const player = await db.collection('players').add({
    name: name,
    score: 0,
    credits: 0
  });

  return player;
};

export async function getPlayer(id) {
  const db = firebase.firestore();
  const player = await db.collection('players').doc(id).get();
  return player.data();
}

export async function getRanking() {
  const db = firebase.firestore();
  const players = await db.collection('players');
  const ranking = await players.orderBy("score", "desc").limit(10).get();

  return ranking.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

export async function addPlayerScore(playerId, score) {
  const db = firebase.firestore();
  const player = db.collection('players').doc(playerId);

  const currentScore = await (await player.get()).data().score;

  player.update({
    score: currentScore + score
  });
}

export async function addPlayerCredits(playerId, credits) {
  const db = firebase.firestore();
  const player = db.collection('players').doc(playerId);

  const currentCredits = await (await player.get()).data().credits;

  player.update({
    credits: currentCredits + credits
  });
}