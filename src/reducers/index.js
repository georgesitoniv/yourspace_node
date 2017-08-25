import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import { 
  conversationMessages,
  currentConversation, 
  conversationMembers, 
  userConversations
} from './reducerUserConversations';
import { authenticatedUser } from './reducerUser.js'; 
import { USER_SIGN_OUT } from '../actions';

const appReducer = combineReducers({
  authenticatedUser,
  conversationMessages,
  currentConversation,
  conversationMembers,
  userConversations,
  form: formReducer,
});

const rootReducer = (action, state) => {
  if(action.type === USER_SIGN_OUT){
    state = undefined;
  }
  return appReducer(state, action);
}

export default appReducer;