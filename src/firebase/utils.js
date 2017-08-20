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
  buildConversationMembersUpdate(conversationKey, members){
    return {['conversation_members/' + conversationKey] : members};
  },
  buildConversationMetaUpdate(conversationKey, message){
    return {
      ['conversations_meta/' + conversationKey + '/messageContent']: message.messageContent,
      ['conversations_meta/' + conversationKey + '/sender']: message.sender,
      ['conversations_meta/' + conversationKey + '/timestamp']: message.timestamp,
    }
  },
  buildNewConversationMeta(members, message, user = null){
    const messageMeta = {...message};
    messageMeta.title = _.map(members, member => { 
      if(user){
        if(member.key != user.key){
          return member.email;
        }
      } else {
        return member.email;
      }
    }).join();
    return messageMeta;
  },
  buildNewConversationMetaUpdate(conversationKey, messageMeta){
    return {
      ['conversations_meta/' + conversationKey]: messageMeta
    }
  },
  buildNewMessageUpdate(conversationKey, message){
    const conversationPath = 'conversations/' + conversationKey;
    const messageKey = firebase.database().ref(conversationPath).push().key;
    return { [conversationPath + '/' + messageKey]: message };
  },
  buildUsersConversationUpdate(conversationKey, members, message){
    let updates = {};
    const userKeys = _.map(members, 'key');
    _.map(userKeys, userKey => {
      updates['user_conversations/' + userKey + '/' + conversationKey + '/messageContent'] = message.messageContent;
      updates['user_conversations/' + userKey + '/' + conversationKey + '/sender'] = message.sender;
      updates['user_conversations/' + userKey + '/' + conversationKey + '/timestamp'] = message.timestamp;
    });
    return updates;
  },
  buildUsersNewConversationUpdate(conversationKey, members, message){
    let updates = {};
    const userKeys = _.map(members, 'key');
    _.map(userKeys, userKey => {
      const messageMeta = this.buildNewConversationMeta(members, message, members[userKey]);
      updates['user_conversations/' + userKey + '/' + conversationKey] = messageMeta
    });
    return updates;
  },
  createConversation(){
    return firebase.database().ref('conversations').push().key;
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
          resolve(this.includeKeyAsProperty(snap.val()));
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
  fetchUserConversations(conversationKeys, limit){
    return new Promise((resolve, reject) => {
      firebase.database().ref('conversations_meta').once('value')
        .then( snap => {
          if(this.isSnapNotNull(snap)){
            const conversations = _.mapKeys(snap.val(), (key, index) => {
              if(_.includes(conversationKeys, key)){
                return snap.val()[key];
              }
            });
            resolve(conversations);
          }
          resolve({});
        })
        .catch(err => reject(err));
    });
  },
  fetchUserConversationsKeys(userKey){
    const ref = firebase.database().ref('user_conversations/' + userKey);
    return new Promise((resolve, reject) => {
      ref.once('value').then(snap => {
        if(this.isSnapNotNull(snap)){
          resolve(snap.val());
        }
        resolve(null);
      })
      .catch(err => reject(err));
    });
  },
  setConversationMembers(conversationKey, memberKeys){
    const conversationRef = firebase.database()
      .ref('conversation_members/' + conversationKey);
    return conversationRef.set(createBooleanObject(memberKeys));
  },
  sendMessage(message){

  },
  updateUserConversations(conversationKey, users){
    let updates = {};
    const conversations = createBooleanObject(users);
    _.map(users, user => {
      updates['user_conversations/' + user] = {[user]: conversations[user]};
    });
    return new Promise((resolve, reject) => {
      console.log(updates);
      resolve();
    })
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