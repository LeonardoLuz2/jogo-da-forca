import firebase from '../../../../firebase';

export async function getWords() {
  const db = firebase.firestore();
  const words = await db.collection('words').get();

  return words.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

export async function getWordsByCategory(categoryId) {
  const db = firebase.firestore();
  const words = await db.collection('words').where("category.id", "==", categoryId).get();

  return words.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

export async function addWord(name, categoryId, callback) {
  const db = firebase.firestore();

  const categoryData = await db.collection('categories').doc(categoryId).get();

  await db.collection('words').add({
    name: name,
    category: {
      id: categoryData.id,
      name: categoryData.data().name
    }
  });

  callback()
};

export async function removeWord(id, callback) {
  const db = firebase.firestore();
  await db.collection('words').doc(id).delete();
  callback();
}