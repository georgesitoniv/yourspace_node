import { USER_SIGN_IN, USER_SIGN_OUT } from '../actions';

export function authenticatedUser(state = null, action){
  switch(action.type){
    case USER_SIGN_IN:
      return action.payload;
    default:
      return state;
  }
}