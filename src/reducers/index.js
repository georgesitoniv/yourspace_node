import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import { 
  conversation,
  currentConversation, 
  conversationMembers, 
  userConversations
} from './reducerUserConversations';

const rootReducer = combineReducers({
  conversation,
  currentConversation,
  conversationMembers,
  userConversations,
  form: formReducer,
});

export default rootReducer;