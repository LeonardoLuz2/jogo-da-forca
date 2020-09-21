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