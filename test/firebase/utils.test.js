require('./index.test');
const _ = require('lodash');
const expect = require('expect');
const fbUtils = require('../../src/firebase/utils.js');

// describe('Fetch Data', () => {
//   it('should fetch users with key', (done) => {
//     fbUtils.fetchUsers('gehan_siton@yahoo.com')
//       .then((users) => {
//         const user = users['1eMCmRqlMtTDn8wMoQDENgl9nsj1'];
//         expect(user).toIncludeKey('key');
//         expect(user).toInclude({
//           email: 'gehan_siton@yahoo.com', 
//           key: '1eMCmRqlMtTDn8wMoQDENgl9nsj1'
//         });
//         done();
//       }).catch((err) => done(err));
//   });
//   // it('should fetch message members', (done) => {
//   //   fbUtils.fetchMessageMembers('123456789')
//   //     .then((members) => {
//   //       console.log(members[1], typeof members);
//   //       done();
//   //     }).catch(err => done(err));
//   // });
// });

// describe('Set Data', () => {
//   // it('should set message members', (done) => {
//   //   fbUtils.setMessageMembers('123456789', ['1', '2'])
//   //     .then(() => {
//   //       done();
//   //     }).catch(err => done(err));
//   // });
//   it('should update user conversations', () => {
//     sendNewMessage('12313132', {
//       messageContent: 'hi',
//       sender: '231312',
//       timestamp: new Date().getTime()
//     }, ['123123123','4564563']);
//   });
// });

// function sendNewMessage(conversationId, message, memberIds){
//   const conversationMembersUpdate = fbUtils.buildConversationMembersUpdate(
//     conversationId, memberIds
//   );
//   const userConversationsUpdate = fbUtils.buildUsersConversationUpdate(
//     conversationId, memberIds
//   );
//   const newMessage = fbUtils.buildNewMessage(conversationId, message);
//   const updates = _.assignIn({}, conversationMembersUpdate, 
//     userConversationsUpdate, newMessage);
//   console.log(updates);
// }