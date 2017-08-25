const firebase = require('firebase');

class FireAuthentication {
  constructor(successCallback = ()=>{}, errorCallback = ()=>{}){
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }

  signIn = () => {};

  signInAndRunCallbacks = () => {};
  
  signOut = () => {
    firebase.auth().signOut();
  };

  getAuthenticatedUser = () => {};

  handleErrorCodes = () => {};
}

module.exports = FireAuthentication;