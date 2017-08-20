import * as firebase from 'firebase';
import fbUtils from '../firebase/utils';

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
    const conversationKey = fbUtils.createConversation();
    dispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: conversationKey
    })
  };
}

export function fetchConversation(conversationKey, limit){
  return dispatch => {
    fbUtils.fetchConversation(conversationKey, limit)
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
    fbUtils.fetchConversationMembers(conversationKey)
      .then(conversationMembers => {
        dispatch({
          type: SET_CONVERSATION_MEMBERS,
          payload: conversationMembers
        });
      })
  } 
}

export function fetchConversationMeta(conversationKey){
  return dispatch => {
    fbUtils.fetchConversationMeta().then(conversationMeta => {
      dispatch({
        type: FETCH_CONVERSATION_META,
        payload: conversationMeta
      });
    });
  }
}

export function fetchUserConversations(userKey, limit){
  return dispatch => {
    fbUtils.fetchUserConversationsKeys(userKey)
      .then(conversationKeys => {
        return fbUtils.fetchUserConversations(conversationKeys, limit);
      })
      .then(conversations => {
        dispatch({
          type: FETCH_USER_CONVERSATIONS,
          payload: conversations
        });
      });
  };
}

export function fetchAuthenticatedUser(){
  return (dispatch, getState) => {
    const { authenticatedUser } = getState(); 
    fbUtils.fetchAuthenticatedUser()
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
      if(fbUtils.isSnapNotNull(snap)){
        dispatch({
          type: FETCH_CONVERSATION,
          payload: fbUtils.includeKeyAsProperty(snap.val())
        })
      }
    });
  }
}

export function listenToUserConversations(userKey, limit){
  return dispatch => {
    const ref = firebase.database().ref('user_conversations/' + userKey);
    ref.limitToLast(limit).on('value', snap => {
      if(fbUtils.isSnapNotNull(snap)){
        dispatch({
          type: FETCH_USER_CONVERSATIONS,
          payload: fbUtils.includeKeyAsProperty(snap.val())
        })
      }
    });
  }
}

export function sendMessage(conversationKey, message, members){
  const updates = buildUpdatesForNewMessage(conversationKey, message, members);
  return dispatch => {
    firebase.database().ref().update(updates).then(() => {
      dispatch(setIsConversationNew(false));
    });
  }
}

export function sendNewMessage(conversationKey, message, members){
  const updates = builUpdatesForNewConversation(conversationKey, message, members);
  return dispatch => {
    firebase.database().ref().update(updates).then(() => {
      dispatch(fetchConversationMembers(conversationKey));
      dispatch(setIsConversationNew(false))
    });
  }
}

export function setIsConversationNew(state){
  return {
    type: SET_CONVERSATION_STATE,
    payload: state
  }
}

export function setCurrentConversationMembers(conversationMembers){
  return {
    type: SET_CONVERSATION_MEMBERS,
    payload: conversationMembers
  }
}

export function setCurrentConversation(conversationKey){
  return {
    type: SET_CURRENT_CONVERSATION,
    payload: conversationKey
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

function builUpdatesForNewConversation(conversationKey, message, members){
  const messageMeta = fbUtils.buildNewConversationMeta(members, message);
  const conversationMetaUpdate = fbUtils.buildNewConversationMetaUpdate(
    conversationKey, messageMeta
  );
  const userConversationsUpdate = fbUtils.buildUsersNewConversationUpdate(
    conversationKey, members, message
  );
  const conversationMembersUpdate = fbUtils.buildConversationMembersUpdate(
    conversationKey, members
  );
  const messageUpdate = fbUtils.buildNewMessageUpdate(conversationKey, message);
  const updates = _.assign({}, 
    conversationMetaUpdate, 
    userConversationsUpdate, 
    conversationMembersUpdate,
    messageUpdate
  );
  return updates;
}

function buildUpdatesForNewMessage(conversationKey, message, members){
  const messageUpdate = fbUtils.buildNewMessageUpdate(conversationKey, message);
  const conversationMeta = fbUtils.buildConversationMetaUpdate(conversationKey, message);
  const userConversationsUpdate = fbUtils.buildUsersConversationUpdate(
    conversationKey, members, message
  );
  const updates = _.assignIn({},
    conversationMeta,
    messageUpdate, 
    userConversationsUpdate
  );
  return updates;
}

// export function removeAuthenticatedUser(user){
//   return {
//     type: SET_AUTHENTICATED_USER,
//     payload: user
//   }; 
// }

// export function signInWithEmail(credentials, okayHandler, errorHandler){
//   return dispatch => {
//     fbUtils.signInWithEmail(credentials.email, credentials.password)
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

