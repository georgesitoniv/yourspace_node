const _ = require('lodash');
const firebase = require('firebase');

class FireMessenger {
  constructor(conversationKey, message, members){
    this.conversationKey = conversationKey;
    this.message = message;
    this.members = members;
    this.updates = {};
  }

  getConversationMeta = () => {
    return {...this.buildNewConversationMeta(), key: this.conversationKey};
  }

  sendNewMessage = () => {
    this.buildUpdatesForNewMessage();
    return firebase.database().ref().update(this.updates);
  }

  sendMessageForNewConversation = () => {
    return this.fetchConversationKeyWithSameMembers().then(key => {
      if(key){
        this.conversationKey = key;
      }
      this.builUpdatesForNewConversationMessage();
      return firebase.database().ref().update(this.updates);
    });
  }

  buildUpdatesForNewMessage = () => {
    const messageMeta = this.buildNewConversationMeta();
    this.buildNewMessageUpdate();
    this.buildConversationMetaUpdate();
    this.buildUsersConversationUpdate(messageMeta);
  }

  builUpdatesForNewConversationMessage = () => {
    const messageMeta = this.buildNewConversationMeta();
    this.buildNewConversationMetaUpdate(messageMeta);
    this.buildUsersNewConversationUpdate();
    this.buildConversationMembersUpdate();
    this.buildNewMessageUpdate();
  }

  buildConversationMembersUpdate = () => {
    const members = {...this.members};
    members.memberEmails = _.map(this.members, member => member.email).join();
    this.updates['conversation_members/' + this.conversationKey] = members;
  }

  buildConversationMetaUpdate = () => {
    const conversationMetaPath = 'conversations_meta/' + this.conversationKey;
    _.assignIn(this.updates, {
      [conversationMetaPath + '/messageContent']: this.message.messageContent,
      [conversationMetaPath + '/sender']: this.message.sender,
      [conversationMetaPath + '/timestamp']: this.message.timestamp,
    });
  }

  buildNewConversationMeta = (user = null) =>{
    let messageMeta = {...this.message};
    let members = {...this.members};
    if(user){
      delete members[user.key];
    }
    messageMeta.title = _.map(members, member => member.email).join();
    messageMeta.isNew = false;
    return messageMeta;
  }

  buildNewConversationMetaUpdate = (messageMeta) => {
    this.updates['conversations_meta/' + this.conversationKey] = messageMeta;
  }

  buildNewMessageUpdate = () => {
    const conversationPath = 'conversations/' + this.conversationKey;
    const messageKey = firebase.database().ref(conversationPath).push().key;
    this.updates[conversationPath + '/' + messageKey] = this.message;
  }

  buildUsersConversationUpdate = (messageMeta) =>{
    const userKeys = _.map(this.members, 'key');
    _.map(userKeys, userKey => {
      const userConversationsPath = 'user_conversations/' + userKey + '/' + this.conversationKey;
      this.updates[userConversationsPath + '/messageContent'] = messageMeta.messageContent;
      this.updates[userConversationsPath + '/sender'] = messageMeta.sender;
      this.updates[userConversationsPath + '/timestamp'] = messageMeta.timestamp;
      this.updates[userConversationsPath + '/isNew'] = messageMeta.isNew;
    });
  }

  buildUsersNewConversationUpdate = () => {
    const members = this.members;
    const userKeys = _.map(members, 'key');
    _.map(userKeys, userKey => {
      const messageMeta = this.buildNewConversationMeta(members[userKey]);
      this.updates['user_conversations/' + userKey + '/' + this.conversationKey] = messageMeta;
    });
  }

  fetchConversationKeyWithSameMembers = () => {
    return new Promise((resolve, reject) => {
      const ref = firebase.database().ref('conversation_members').orderByChild('memberEmails');
      ref.equalTo(_.map(this.members, member => member.email).join()).once('value')
        .then(snap => {
          if(snap.val()){
            resolve(Object.keys(snap.val())[0]);
          }
          resolve(null);
        });
    });
  }

}

module.exports = FireMessenger;
