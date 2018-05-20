importScripts('https://www.gstatic.com/firebasejs/5.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.1/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyDgX5brEjK9Fki-FsN4NyJLXb8DnWZeY18",
    authDomain: "tapau-55828.firebaseapp.com",
    databaseURL: "https://tapau-55828.firebaseio.com",
    projectId: "tapau-55828",
    storageBucket: "tapau-55828.appspot.com",
    messagingSenderId: "177427121610"
  };
  firebase.initializeApp(config);
  const msg = firebase.messaging();
