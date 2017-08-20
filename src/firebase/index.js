const firebase = require('firebase');

const configs = {
  "development": {
    apiKey: "AIzaSyDIUfVSjAb9qr3UWzMvRRNNYTH2eJA9-ac",
    authDomain: "your-space-42921.firebaseapp.com",
    databaseURL: "https://your-space-42921.firebaseio.com",
    projectId: "your-space-42921",
    storageBucket: "",
    messagingSenderId: "912171300357"
  },
  "test": {
    apiKey: "AIzaSyCocjBYSPHb51XaSlX2ovpifutVo8l86kw",
    authDomain: "your-space-test.firebaseapp.com",
    databaseURL: "https://your-space-test.firebaseio.com",
    projectId: "your-space-test",
    storageBucket: "your-space-test.appspot.com",
    messagingSenderId: "359995676547"
  }
};

const config = configs[process.env.NODE_ENV];

if(!firebase.apps.length){
  firebase.initializeApp(config);
}

module.exports = {config};