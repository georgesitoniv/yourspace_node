import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import { 
  conversationMessages,
  currentConversation, 
  conversationMembers, 
  userConversations
} from './reducerUserConversations';

const rootReducer = combineReducers({
  conversationMessages,
  currentConversation,
  conversationMembers,
  userConversations,
  form: formReducer,
});

export default rootReducer;