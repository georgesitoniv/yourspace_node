const _ = require('lodash');
const expect = require('expect');
const fireMessenger = require('../../src/firebase/messenger');
const firebase = require('firebase');

const conversationKeys = ['123456789', '0987654321'];
const message = {
  messageContent: 'new message',
  sender: {email: 'test@test.com', key:'1'},
  timestamp: new Date().getTime()
}
const members = {
  '1': {email: 'test@test.com', key:'1'},
  '2': {email: 'new@test.com', key:'2'}
}

before((done) => {
  firebase.database().ref().remove().then(() =>{
    const messenger = new fireMessenger(conversationKeys[0], message, members);
    return messenger.sendMessageForNewConversation();
  }).then(() => done())
  .catch(err => done(err));
})

describe('Sending message', () => {
  it('should send a message for a new conversation', (done) => {
    const members = {
      '1': {email: 'test@test.com', key:'1'},
      '2': {email: 'new@test.com', key:'2'},
      '3': {email: 'new@new.com', key:'3'}
    }
    const messenger = new fireMessenger(conversationKeys[1], message, members);
    messenger.sendMessageForNewConversation().then(() => {
      return firebase.database().ref('conversations/' + conversationKeys[1]).once('value');
    }).then(conversationMessages => {
      const messages = _.map(conversationMessages.val());
      expect(messages[0]).toInclude(message);
      done();
    }).catch(err => done(err));
  });

  it('should a new message to an existing conversation', (done) => {
    const message = {
      messageContent: 'hey',
      sender: {email: 'new@test.com', key:'2'},
      timestamp: new Date().getTime()
    }
    const messenger = new fireMessenger(conversationKeys[0], message, members);
    messenger.sendNewMessage().then(() => {
      return firebase.database().ref().once('value');
    }).then(snap => {
      const database = snap.val();
      const conversationMessages = _.map(database['conversations'][conversationKeys[0]]);
      const userConversations = database['user_conversations'];
      expect(conversationMessages[1]).toInclude(message);
      expect(userConversations['1'][conversationKeys[0]]).toInclude({...message, isNew: false})
      expect(userConversations['1'][conversationKeys[0]]['title']).toInclude('new@test.com');
      done();
    }).catch(err => done(err));
  });

  it('should send to an existing conversation if members are the same', (done) => {
    const conversationKey = '2143658709';
    const messenger = new fireMessenger(conversationKey, message, members);
    messenger.sendMessageForNewConversation().then(() => {
      return firebase.database().ref('conversations/' + conversationKeys[0]).once('value');
    }).then(snap => {
      const conversation = _.map(snap.val());
      expect(conversation.length).toBe(3);
      expect(conversation[2]).toInclude(message);
      done();
    }).catch(err => done(err));
  });

}); 