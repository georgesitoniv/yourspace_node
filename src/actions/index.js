import * as firebase from 'firebase';
import fireUtils from '../firebase/utils';
import fireMessenger from '../firebase/messenger';

export const FETCH_AUTHENTICATED_USER = 'FETCH_AUTHENTICATED_USER';
export const FETCH_CONVERSATION_MESSAGES = 'FETCH_CONVERSATION_MESSAGES';
export const FETCH_CONVERSATION_META = 'FETCH_CONVERSATION_META'
export const FETCH_USER_CONVERSATIONS = 'FETCH_USER_CONVERSATIONS';
export const SET_CONVERSATION_MEMBERS = 'SET_CONVERSATION_MEMBERS';
export const SET_CONVERSATION_STATE = 'SET_CONVERSATION_STATE';
export const SET_CURRENT_CONVERSATION = 'SET_CURRENT_CONVERSATION';

export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';

export function createConversation(){
  return dispatch => {
    const conversationKey = fireUtils.createConversation();
    dispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: conversationKey
    });
    dispatch(setCurrentConversationMembers({}));
  };
}

export function fetchConversationMembers(conversationKey){
  return dispatch => {
    fireUtils.fetchConversationMembers(conversationKey)
      .then(conversationMembers => {
        dispatch({
          type: SET_CONVERSATION_MEMBERS,
          payload: conversationMembers
        });
      })
  } 
}

export function fetchAuthenticatedUser(){
  return (dispatch, getState) => {
    const { authenticatedUser } = getState(); 
    fireUtils.fetchAuthenticatedUser()
      .then(user => {
        dispatch({

        });
      });
  };
}

export function signInWithCallbacks(FireAuthObject){
  return dispatch => {
    FireAuthObject.signInAndRunCallbacks().then(user => {
      return fireUtils.fetchUsers(user.email);
    }).then(authUser => {
      dispatch({
        type: USER_SIGN_IN,
        payload: authUser
      });
    });
  };
}

export function signOut(){
  return{
    type: USER_SIGN_OUT,
    payload: null
  }
};

export function sendMessage(conversationKey, message, members){s
  const messenger = new fireMessenger(conversationKey, message, members);
  return dispatch => {
    messenger.sendNewMessage().then(() => {
      dispatch(setCurrentConversation(messenger.getConversationMeta()));
    });
  }
}

export function sendNewMessage(conversationKey, message, members){
  const messenger = new fireMessenger(conversationKey, message, members);
  return dispatch => {
    messenger.sendMessageForNewConversation().then(() => {
      dispatch(setCurrentConversation(messenger.getConversationMeta()));
    });
  }
}

export function startConversationMessagesListener(conversationKey, limit){
  return dispatch => {
    const callback = messages => dispatch({
        type: FETCH_CONVERSATION_MESSAGES,
        payload: fireUtils.includeKeyAsProperty(messages)
      });
    fireUtils.startValueListenerWithLimit('conversations/' + conversationKey, limit, callback);
  }
}

export function startUserConversationsListener(userKey, limit){
  return dispatch => {
    const callback = conversations => dispatch({
        type: FETCH_USER_CONVERSATIONS,
        payload: fireUtils.includeKeyAsProperty(conversations)
      });
    fireUtils.startValueListenerWithLimit('user_conversations/' + userKey, limit, callback);
  }
}

export function setCurrentConversationMembers(conversationMembers){
  return {
    type: SET_CONVERSATION_MEMBERS,
    payload: conversationMembers
  }
}

export function setCurrentConversation(conversation){
  return {
    type: SET_CURRENT_CONVERSATION,
    payload: conversation
  }
}

export function stopConversationMessagesListener(conversationKey){
  fireUtils.stopValueListener('conversations/' + conversationKey);
  return{
    type: FETCH_CONVERSATION_MESSAGES,
    payload: {}
  }
}

export function stopUserConversationsListener(){
  fireUtils.stopValueListener('user_conversations/' + userKey);
  return{
    type: FETCH_USER_CONVERSATIONS,
    payload: {}
  }
}

// export function removeAuthenticatedUser(user){
//   return {
//     type: SET_AUTHENTICATED_USER,
//     payload: user
//   }; 
// }

// export function signInWithEmail(credentials, okayHandler, errorHandler){
//   return dispatch => {
//     fireUtils.signInWithEmail(credentials.email, credentials.password)
//       .then(user => {
//         okayHandler();
//         dispatch({
//           type: SIGN_IN_WITH_EMAIL,
//           payload: user
//         })
//       })
//       .catch(errorHandler())
//   };
// }

// export function signOut(okayHandler = () => {}, errorHandler = () => {}){
//   return dispatch => {
//     firebase.auth().signOut()
//       .then(() => {
//         okayHandler();
//         dispatch({
//           type: SIGN_OUT_WITH_EMAIL,
//           payload: null
//         })
//       })
//       .catch(errorHandler());
//   }
// }

