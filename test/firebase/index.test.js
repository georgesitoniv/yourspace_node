const firebase = require('firebase');
const {config} = require('../../src/firebase/index');

if(!firebase.apps.length){
  firebase.initializeApp(config);  
}