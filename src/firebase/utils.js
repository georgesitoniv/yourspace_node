const firebase = require('firebase');
const _ = require('lodash');

const createBooleanObject = (items) => {
  let booleanObject = {};
  _.map(items, (item) => {
    booleanObject[item] = true;
  });
  return booleanObject;
};

const isValidObject = (object) => {
  if(object){
    if(typeof object == 'object'){
      if(Object.keys(object).length > 0){
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  createConversation(){
    const key = firebase.database().ref('conversations').push().key;
    return { key, isNew: true};
  },
  fetchAuthenticatedUser(){
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.fetchData('value', 'users/' + user.uid)
            .then(authUser => {
              if(isValidObject(authUser)){
                resolve({...authUser, key: user.uid});
              }
            }).catch(err => reject(err));
        }
      });
    })
  },
  fetchConversationMembers(conversationKey){
    return new Promise((resolve, reject) => {
      this.fetchData('value', 'conversation_members/' + conversationKey)
        .then(conversationMembers => {
          if(isValidObject(conversationMembers)){
            delete conversationMembers.memberEmails;
          }
          resolve(this.includeKeyAsProperty(conversationMembers))
        }).catch(err => reject(err));
    });
  },
  fetchUsers(email){
    const query = firebase.database().ref('users').orderByChild('email')
      .startAt(email).endAt(email + '\u{f8ff}');
    return new Promise((resolve, reject) => {
      query.once('value').then(snap => {
        resolve(this.includeKeyAsProperty(snap.val()));
      }).catch((err) => reject(err));
    });
  },
  startValueListenerWithLimit(path, limit, callback){
    this.startListenerWithLimit('value', path, limit, callback);
  },
  stopValueListener(path){
    this.stopListener('value', path);
  },
  fetchData(event, path){
    return new Promise((resolve, reject) => {
      firebase.database().ref(path).once(event).then(snap => {
        resolve(snap.val());
      }).catch(err => reject(err));
    });
  },
  startListenerWithLimit(event, path, limit, callback){
    const ref = firebase.database().ref(path).limitToLast(limit);
    ref.on(event, snap => callback(snap.val()));
  },
  stopListener(event, path){
    firebase.database().ref(path).off(event);
  },
  includeKeyAsProperty(object){
    if(isValidObject(object)){
      Object.keys(object).map((key, index) => {
        if(typeof object[key] == 'object'){
          object[key].key = key;
        }
      });
    }
    return object;
  }
};