import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import question from './question';

export default combineReducers({
  alert,
  auth,
  question,
});
