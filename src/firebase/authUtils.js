const firebase = require('firebase');

const emailAuth = {
  handleErrorCodes(err){
    switch(err){
      case 'auth/user-not-found':
        return 'User does not exists.';
      case 'auth/invalid-email':
        return 'Sorry, the email is invalid'
      case 'auth/wrong-password':
        return 'Sorry, the password is incorrect.';
    };
  }
}

module.exports = {
  emailAuth
};