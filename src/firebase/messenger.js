const firebase = require('firebase');
const _ = require('lodash');

class Messenger{
  constructor(conversationKey, message, members){
    this.conversationKey = conversationKey;
    this.message = message;
    this.members = members;
    this.updates = {};
  }

  sendNewMessage = () => {
    this.buildUpdatesForNewMessage();
    return firebase.database().ref().update(this.updates);
  }

  sendMessageForNewConversation = () =>{
    this.builUpdatesForNewConversationMessage();
    return firebase.database().ref().update(this.updates);
  }

  buildUpdatesForNewMessage = () => {
    this.buildNewMessageUpdate();
    this.buildConversationMetaUpdate();
    this.buildUsersConversationUpdate();
  }

  builUpdatesForNewConversationMessage = () => {
    const messageMeta = this.buildNewConversationMeta();
    this.buildNewConversationMetaUpdate(messageMeta);
    this.buildUsersNewConversationUpdate();
    this.buildConversationMembersUpdate();
    this.buildNewMessageUpdate();
  }

  buildConversationMembersUpdate = () => {
    this.updates['conversation_members/' + this.conversationKey] = this.members;
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
    const messageMeta = this.message;
    const members = this.members;
    if(user){
      delete members[user.key];
    }
    messageMeta.title = _.map(members, member => member.email).join();
    return messageMeta;
  }

  buildNewConversationMetaUpdate = (messageMeta) => {
    messageMeta.isNew = true;
    this.updates['conversations_meta/' + this.conversationKey] = messageMeta;
  }

  buildNewMessageUpdate = () => {
    const conversationPath = 'conversations/' + this.conversationKey;
    const messageKey = firebase.database().ref(conversationPath).push().key;
    this.updates[conversationPath + '/' + messageKey] = message;
  }

  buildUsersConversationUpdate = () =>{
    const userKeys = _.map(this.members, 'key');
    _.map(userKeys, userKey => {
      const userConversationsPath = 'user_conversations/' + userKey + '/' + this.conversationKey;
      this.updates[userConversationsPath + '/messageContent'] = this.message.messageContent;
      this.updates[userConversationsPath + '/sender'] = this.message.sender;
      this.updates[userConversationsPath + '/timestamp'] = this.message.timestamp;
    });
  }

  buildUsersNewConversationUpdate = () => {
    const members = this.members;
    const userKeys = _.map(members, 'key');
    _.map(userKeys, userKey => {
      const messageMeta = this.buildNewConversationMeta(members, this.message, members[userKey]);
      this.updates['user_conversations/' + userKey + '/' + conversationKey] = messageMeta
    });
  }

}

module.exports = Messenger;
