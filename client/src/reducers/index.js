import { combineReducers } from 'redux';

export default combineReducers({
  sampleReducer: (state = null, action) => {
    switch (action.type) {

      case "TEST":
        return action.payload || false;

      default: return state;
    }
  }
});
