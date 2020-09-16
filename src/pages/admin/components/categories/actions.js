import firebase from '../../../../firebase';

export async function getCategories() {
  const db = firebase.firestore();
  const categories = await db.collection('categories').get();

  return categories.docs.map(doc => {
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
  const db = firebase.firestore();
  await db.collection('categories').doc(id).delete();
  callback();
}

export async function updateCategory(id, name, callback) {
  const db = firebase.firestore();
  const category = db.collection('categories').doc(id);

  category.update({
    name: name
  });
  callback();
}