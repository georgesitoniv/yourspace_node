import * as firebase from 'firebase';
import fireUtils from '../firebase/utils';
import fireMessenger from '../firebase/messenger';

export const FETCH_AUTHENTICATED_USER = 'FETCH_AUTHENTICATED_USER';
export const FETCH_CONVERSATION = 'FETCH_CONVERSATION';
export const FETCH_CONVERSATION_META = 'FETCH_CONVERSATION_META'
export const FETCH_USER_CONVERSATIONS = 'FETCH_USER_CONVERSATIONS';
export const SET_CONVERSATION_MEMBERS = 'SET_CONVERSATION_MEMBERS';
export const SET_CONVERSATION_STATE = 'SET_CONVERSATION_STATE';
export const SET_CURRENT_CONVERSATION = 'SET_CURRENT_CONVERSATION';

export const SIGN_IN_WITH_EMAIL = 'SIGN_IN_WITH_EMAIL';
export const SIGN_OUT_WITH_EMAIL = 'SIGN_OUT_WITH_EMAIL';

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

export function fetchConversation(conversationKey, limit){
  return dispatch => {
    fireUtils.fetchConversation(conversationKey, limit)
      .then(conversation => {
        dispatch({
          type: FETCH_CONVERSATION,
          payload: conversation
        })
      });
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

export function listenToConversation(conversationKey, limit){
  return dispatch => {
    const ref = firebase.database().ref('conversations/' + conversationKey).limitToLast(limit);
    ref.on('value', snap => {
      if(fireUtils.isSnapNotNull(snap)){
        dispatch({
          type: FETCH_CONVERSATION,
          payload: fireUtils.includeKeyAsProperty(snap.val())
        })
      }
    });
  }
}

export function listenToUserConversations(userKey, limit){
  return dispatch => {
    const ref = firebase.database().ref('user_conversations/' + userKey);
    ref.limitToLast(limit).on('value', snap => {
      if(fireUtils.isSnapNotNull(snap)){
        dispatch({
          type: FETCH_USER_CONVERSATIONS,
          payload: fireUtils.includeKeyAsProperty(snap.val())
        })
      }
    });
  }
}

export function sendMessage(conversationKey, message, members){
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

export function stopUserConversationsListener(){
  firebase.database().ref('user_conversations/' + userKey).off('value');
  return{
    type: FETCH_USER_CONVERSATIONS,
    payload: {}
  }
}

export function stopConversationListener(conversationKey){
  firebase.database().ref('conversations/' + conversationKey).off('value');
  return{
    type: FETCH_CONVERSATION,
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

