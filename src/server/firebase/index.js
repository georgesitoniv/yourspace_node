const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyDIUfVSjAb9qr3UWzMvRRNNYTH2eJA9-ac",
  authDomain: "your-space-42921.firebaseapp.com",
  databaseURL: "https://your-space-42921.firebaseio.com",
  projectId: "your-space-42921",
  storageBucket: "",
  messagingSenderId: "912171300357"
};

if(!firebase.apps.lenght){
  firebase.initializeApp(config);
}

const database = firebase.database();

module.exports = {config, database};