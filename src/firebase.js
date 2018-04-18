import firebase from 'firebase'
import 'firebase/firestore';
const config = {
  apiKey: "AIzaSyDgX5brEjK9Fki-FsN4NyJLXb8DnWZeY18",
  authDomain: "tapau-55828.firebaseapp.com",
  databaseURL: "https://tapau-55828.firebaseio.com",
  projectId: "tapau-55828",
  storageBucket: "tapau-55828.appspot.com",
  messagingSenderId: "177427121610"
};
firebase.initializeApp(config);
export default firebase

