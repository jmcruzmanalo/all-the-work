import { combineReducers } from 'redux';
import serverReducer from './serverReducer';
import { reducer as formsReducer } from 'redux-form';

export default combineReducers({
  server: serverReducer,
  form: formsReducer
});
