import * as actionTypes from '../actions/actionTypes';

// This is for `server` in redux
// server = sampleState in redux
// const sampleState = {
//   serverId: 'serverId',
//   serverEditPasswordStatus: 'INVALID' || 'VALID' || 'LOADING'
//   }
// };

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_SERVER:
      return {
        ...state,
        serverId: action.payload
      };

    case actionTypes.SET_ACTIVE_SERVER_PASSWORD_STATUS:
      return {
        ...state,
        serverEditPasswordStatus: action.payload
      };

    case actionTypes.SET_SERVER_RATING_EDIT_DEFAULTS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};
