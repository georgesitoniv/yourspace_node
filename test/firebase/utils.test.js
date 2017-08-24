require('./index.test');
const _ = require('lodash');
const expect = require('expect');
const fireUtils = require('../../src/firebase/utils.js');
const fireMessenger = require('../../src/firebase/messenger');
const {conversationKeys, message, members} = require('./index.test');

describe('Fire Utils', () => {
  it('should create a new conversation', () => {
    const converation = fireUtils.createConversation();
    expect(converation).toIncludeKeys(['key', 'isNew'])
    expect(converation).toInclude({isNew: true});
  });
  
  it('should fetch conversation members', (done) => {
    fireUtils.fetchConversationMembers(conversationKeys[0]).then(converationMembers => {
      expect(converationMembers).toInclude(members);
      done();
    }).catch(err => done(err));
  });

  it('should fetch users', (done) => {
    fireUtils.fetchUsers('test').then(users => {
      expect(users).toInclude(members['1']);
      done();
    }).catch(err => done(err));
  });

  describe('Listen to Conversation Messages', () => {
    const message = {
      messageContent: 'listener test',
      sender: {email: 'new@test.com', key:'1'},
      timestamp: new Date().getTime()
    }
    let conversationMessages = {};

    before('should listen to conversation messages', () => {
      const callback = messages => {
        conversationMessages = messages;
      }
      fireUtils.startValueListenerWithLimit('conversations/' + conversationKeys[0], 10, callback);
    });
  
    it('should listen to conversation messages', (done) => {
      const messenger = new fireMessenger(conversationKeys[0], message, members);
      messenger.sendNewMessage().then(() => {
        expect(_.map(conversationMessages)).toInclude(message);
        fireUtils.stopValueListener('conversations/' + conversationKeys[0]);
        done();
      }).catch(err => done(err));
    });
  });
});