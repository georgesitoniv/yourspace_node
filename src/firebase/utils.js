const firebase = require('firebase');
const _ = require('lodash');

const createBooleanObject = (items) => {
  let booleanObject = {};
  _.map(items, (item) => {
    booleanObject[item] = true;
  });
  return booleanObject;
};

module.exports = {
  createConversation(){
    const key = firebase.database().ref('conversations').push().key;
    return { key, isNew: true};
  },
  fetchAuthenticatedUser(){
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          firebase.database().ref('users/' + user.uid).once('value')
          .then(snap => {
            if(this.isSnapNotNull(snap)){
              resolve({...snap.val(), key: user.uid});
            }
          })
          .catch(err => reject(err));
        }
      });
    })
  },
  fetchConversation(conversationKey, limit){
    const ref = firebase.database().ref('conversations/' + conversationKey).limitToLast(limit);
    return new Promise((resolve, reject) => {
      ref.once('value').then(snap => {
        if(this.isSnapNotNull(snap)){
          resolve(this.includeKeyAsProperty(conversation));
        }
        resolve(null);
      });
    });
  },
  fetchConversationMembers(conversationKey){
    const conversationMembersRef = firebase.database()
      .ref('conversation_members/' + conversationKey);
    return new Promise((resolve, reject) => {
      conversationMembersRef.once('value').then(snap => {
        if(this.isSnapNotNull(snap)){
          const members = this.includeKeyAsProperty(snap.val());
          delete members.memberEmails;
          resolve(members);
        }
        resolve({});
      }).catch(err => reject(err));
    });
  },
  fetchConversationMeta(conversationKey){
    const conversationMetaRef = firebase.database().ref('conversation_meta/' + conversationKey);
    return new Promise((resolve, reject) => {
      conversationMetaRef.once('value').then(snap => {
        if(this.isSnapNotNull(snap)){
          resolve(this.includeKeyAsProperty(snap.val()));
        }
        resolve({});
      }).catch(err => reject(err));
    });
  },
  fetchUsers(email){
    const query = firebase.database().ref('users').orderByChild('email')
      .startAt(email).endAt(email + '\u{f8ff}');
    return new Promise((resolve, reject) => {
      query.once('value').then(snap => {
        if(this.isSnapNotNull(snap)){
          resolve(this.includeKeyAsProperty(snap.val()));
        }
        resolve(null);
      }).catch((err) => reject(err));
    });
  },
  includeKeyAsProperty(object){
    Object.keys(object).map((key, index) => {
      if(typeof object[key] == 'object'){
        object[key].key = key;
      }
    });
    return object;
  }, 
  isSnapNotNull(snap){
    if(snap){
      if(snap.val()){
        return true;
      }
    }
    return false;
  }
};