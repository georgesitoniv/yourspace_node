import { 
  FETCH_CONVERSATION,
  FETCH_CONVERSATION_META,
  FETCH_USER_CONVERSATIONS,
  SET_CONVERSATION_META,
  SET_CONVERSATION_MEMBERS,
  SET_CONVERSATION_STATE,
  SET_CURRENT_CONVERSATION
} from '../actions';

export function conversation(state = null, action){
  switch(action.type){
    case FETCH_CONVERSATION:
      return action.payload;
    default:
      return state;
  }
}

export function currentConversation(state = null, action){
  switch(action.type){
    case SET_CURRENT_CONVERSATION:
      return action.payload;
    default:
      return state;
  }
}

export function conversationMembers(state = {}, action){
  switch(action.type){
    case SET_CONVERSATION_MEMBERS:
      return action.payload;
    default:
      return state;
  }
}

export function conversationMeta(state = null, action){
  switch(action.type){
    case FETCH_CONVERSATION_META:
      return action.payload;
    default:
      return state;
  }
}

export function isConversationNew(state = true, action){
  switch(action.type){
    case SET_CONVERSATION_STATE:
      return action.payload;
    default:
      return state;
  }
}

export function userConversations(state = {}, action){
  switch(action.type){
    case FETCH_USER_CONVERSATIONS:
      return action.payload;
    default:
      return state;
  }
}