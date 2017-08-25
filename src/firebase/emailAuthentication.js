const firebase = require('firebase');
const FireAuthentication = require('./authentication');

class FireEmailAuthentication extends FireAuthentication{
  constructor(email, password, successCallback = ()=>{}, errorCallback = ()=>{}){
    super(successCallback, errorCallback);
    this.email = email;
    this.password = password;
  }

  createUser = () => {
    return new Promise(async (resolve, reject) => {
      try{
        const authUser = await firebase.auth().createUserWithEmailAndPassword(
          this.email, this.password
        );
        await firebase.database().ref('users/' + authUser.uid).set({email: authUser.email});
        resolve(authUser);
      } catch(err){
        reject(err);
      }
    });
  };

  createUserAndRunCallbacks = () => {
    return new Promise((resolve, reject) => {
      this.createUser().then(user => {
        this.successCallback(user);
        resolve(user);
      }).catch(err => {
        this.errorCallback(err)
        reject(err);
      });
    });
  };

  signIn = () => {
    return firebase.auth().signInWithEmailAndPassword(this.email, this.password);
  }

  signInAndRunCallbacks = () => {
    return new Promise((resolve, reject) => {
      this.signIn().then(user => {
        this.successCallback(user);
        resolve(user);
      }).catch(err => {
        this.errorCallback(err);
        reject(err);
      });
    });
  };

}

module.exports = FireEmailAuthentication;