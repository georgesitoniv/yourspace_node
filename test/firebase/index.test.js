const firebase = require('firebase');
const {config} = require('../../src/firebase/index');
const fireMessenger = require('../../src/firebase/messenger');

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

if(!firebase.apps.length){
  firebase.initializeApp(config);  
}

before((done) => {
  firebase.database().ref().remove().then(() =>{
    const messenger = new fireMessenger(conversationKeys[0], message, members);
    const writeUsers = firebase.database().ref('users').set(members);
    return Promise.all([writeUsers, messenger.sendMessageForNewConversation()]);
  }).then(() => done())
  .catch(err => done(err));
})

module.exports = {conversationKeys, message, members};