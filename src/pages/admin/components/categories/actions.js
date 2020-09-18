import firebase from '../../../../firebase';

export async function getCategories() {
  const db = firebase.firestore();
  const categories = await db.collection('categories').get();

  return categories.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

export async function getWords() {
  const db = firebase.firestore();
  const words = await db.collection('words').get();

  return words.docs.map(doc => {
    return { id: doc.id, ...doc.data() }
  })
}

export async function addCategory(name, callback) {
  const db = firebase.firestore();
  await db.collection('categories').add({
    name: name,
  });

  callback()
};

export async function removeCategory(id, callback) {
  if (await hasCategoryInWord(id)) {
    return false;
  }
  const db = firebase.firestore();
  await db.collection('categories').doc(id).delete();
  callback();
  return true;
}

export async function updateCategory(id, name, callback) {
  const db = firebase.firestore();
  const category = db.collection('categories').doc(id);

  category.update({
    name: name
  });
  callback();
}

export async function hasCategoryInWord(idCategory) {
  let hasCategoryInWord = false
  const wordArray = await getWords();
  const categoryArray = await getCategories();
  const categorySelected = categoryArray.filter(category => { if (category.id == idCategory) return category });
  wordArray.map(word => { if (word.category.name == categorySelected[0].name) hasCategoryInWord = true })
  return hasCategoryInWord;
}